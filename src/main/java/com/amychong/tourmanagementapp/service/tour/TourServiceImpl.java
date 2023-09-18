package com.amychong.tourmanagementapp.service.tour;

import com.amychong.tourmanagementapp.entity.tour.*;
import com.amychong.tourmanagementapp.exception.NotFoundException;
import com.amychong.tourmanagementapp.repository.booking.BookingRepository;
import com.amychong.tourmanagementapp.repository.tour.PointOfInterestRepository;
import com.amychong.tourmanagementapp.repository.tour.StartDateRepository;
import com.amychong.tourmanagementapp.repository.tour.TourImageRepository;
import com.amychong.tourmanagementapp.repository.tour.TourRepository;
import com.amychong.tourmanagementapp.service.helper.TourStartDateHelper;
import com.amychong.tourmanagementapp.service.helper.ValidationHelper;
import com.amychong.tourmanagementapp.service.generic.GenericServiceImpl;
import com.amychong.tourmanagementapp.util.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
public class TourServiceImpl extends GenericServiceImpl<Tour, Tour> implements TourService {

    private final TourRepository tourRepository;
    private final TourImageRepository tourImageRepository;
    private final PointOfInterestRepository pointOfInterestRepository;
    private final StartDateRepository startDateRepository;
    private final BookingRepository bookingRepository;

    @Autowired
    public TourServiceImpl(TourRepository theTourRepository, TourImageRepository theTourImageRepository, PointOfInterestRepository thePointOfInterestRepository, StartDateRepository theStartDateRepository, BookingRepository theBookingRepository) {

        super(theTourRepository, Tour.class, Tour.class);
        tourRepository = theTourRepository;
        tourImageRepository = theTourImageRepository;
        pointOfInterestRepository = thePointOfInterestRepository;
        startDateRepository = theStartDateRepository;
        bookingRepository = theBookingRepository;
    }

    @Override
    public Tour findById(Integer inputTourId) {
        Tour foundTour = super.findById(inputTourId);
        setAvailableSpaces(foundTour);
        return foundTour;
    }

    @Override
    public Tour findByIdWithDetails(Integer tourId) {
        Optional<Tour> tourWithImages = tourRepository.findByIdWithTourImages(tourId);
        tourRepository.findByIdWithTourPointsOfInterest(tourId); // This populates the cache
        tourRepository.findByIdWithTourStartDates(tourId); // This too populates the cache

        return tourWithImages.orElseThrow(() -> new NotFoundException("Did not find tour id - " + tourId));
    }

    @Override
    public List<Tour> findAvailableToursWithinRange(LocalDate startDate, LocalDate endDate) {
        ValidationHelper.validateNotNull(startDate, "startDate must not be null.");
        ValidationHelper.validateNotNull(endDate, "endDate must not be null.");

        return tourRepository.findAvailableToursWithinRange(startDate, endDate);
    }

    @Override
    @Transactional
    public Tour save(Tour tour) {
        return super.save(tour);
    }

    @Override
    @Transactional
    public Tour create(Tour inputTour) {
        ValidationHelper.validateNotNull(inputTour, "Tour must not be null.");

        Tour copyOfInputTour = inputTour.deepCopy();
        processTourImagesForCreate(copyOfInputTour);
        processTourPointsOfInterestForCreate(copyOfInputTour);
        processTourStartDatesForCreate(copyOfInputTour);

        return super.create(copyOfInputTour);
    }

    private void processTourImagesForCreate(Tour inputTour) {
        CollectionUtils.nullToEmpty(inputTour.getTourImages()).forEach(image -> {
            image.setId(0);
            image.setTour(inputTour);
        });
    }

    private void processTourPointsOfInterestForCreate(Tour inputTour) {
        List<TourPointOfInterest> inputTourPointsOfInterest = CollectionUtils.nullToEmpty(inputTour.getTourPointsOfInterest());

        // get points of interest that match the names of the input points of interest from the database
        List<PointOfInterest> existingPOIs = TourUpdateProcessor.findExistingAssociatedEntitiesFromUniqueField(
                inputTourPointsOfInterest,
                TourPointOfInterest::getPointOfInterest,
                PointOfInterest::getName,
                names -> pointOfInterestRepository.findAllByNameIn(names)
        );

        inputTourPointsOfInterest.forEach(tourPOI -> {
            TourUpdateProcessor.setEntityId(tourPOI.getPointOfInterest(), existingPOIs);
            tourPOI.setId(0);
            tourPOI.setTour(inputTour);
        });
    }

    private void processTourStartDatesForCreate(Tour inputTour) {
        List<TourStartDate> inputTourStartDates = CollectionUtils.nullToEmpty(inputTour.getTourStartDates());

        // get start dates that match the date-times of the input start dates from the database
        List<StartDate> existingStartDates = TourUpdateProcessor.findExistingAssociatedEntitiesFromUniqueField(
                inputTourStartDates,
                TourStartDate::getStartDate,
                StartDate::getStartDateTime,
                dateTimes -> startDateRepository.findAllByStartDateTimeIn(dateTimes)
        );

        inputTourStartDates.forEach(tourStartDate -> {
            TourUpdateProcessor.setEntityId(tourStartDate.getStartDate(), existingStartDates);
            tourStartDate.setId(new TourStartDateKey(0, 0));
            tourStartDate.setTour(inputTour);
        });
    }

    @Override
    public Tour update(Integer inputTourId, Tour inputTour) {
        throw new UnsupportedOperationException("The generic update operation is not supported. Please use the specific update methods provided.");
    }

    @Override
    @Transactional
    public Tour updateMainInfo(Integer inputTourId, Tour inputTour) {
        ValidationHelper.validateNotNull(inputTour, "Tour must not be null.");

        Tour existingTour = findById(inputTourId);
        validateMaxGroupSize(existingTour, inputTour.getMaxGroupSize());

        Tour copyOfExistingTour = existingTour.deepCopy();
        copyOfExistingTour.setMainFields(inputTour);

        return super.save(copyOfExistingTour);
    }

    @Override
    @Transactional
    public void updateTourRatingsAfterAddingReview(Tour associatedTour, Integer newRating) {
        Float oldAverage = associatedTour.getRatingsAverage();
        int oldCount = associatedTour.getRatingsCount();

        if (oldAverage == null) {
            oldAverage = 0.0f;
        }

        Float newAverage = ((oldAverage * oldCount) + newRating) / (float) (oldCount + 1);

        associatedTour.setRatingsCount(oldCount + 1);
        associatedTour.setRatingsAverage(newAverage);

        tourRepository.save(associatedTour);
    }

    @Override
    @Transactional
    public void updateTourRatingsAfterDeletingReview(Tour associatedTour, Integer deletedRating) {
        Float oldAverage = associatedTour.getRatingsAverage();
        int oldCount = associatedTour.getRatingsCount();

        if (oldCount <= 1) {
            associatedTour.setRatingsCount(0);
            associatedTour.setRatingsAverage(null);
        } else {
            Float newAverage = ((oldAverage * oldCount) - deletedRating) / (float) (oldCount - 1);

            associatedTour.setRatingsCount(oldCount - 1);
            associatedTour.setRatingsAverage(newAverage);
        }

        tourRepository.save(associatedTour);
    }

    private void setAvailableSpaces(Tour tour) {
        if (tour == null) {
            return;
        }
        List<TourStartDate> tourStartDates = tour.getTourStartDates();
        tourStartDates.forEach(tourStartDate -> {
            Integer totalBookedSpaces = bookingRepository.sumParticipantsByTourStartDate(tourStartDate);
            Integer availableSpaces = TourStartDateHelper.computeAvailableSpacesForStartDates(tourStartDate, totalBookedSpaces);
            tourStartDate.setAvailableSpaces(availableSpaces);
        });
    }

    private void validateMaxGroupSize(Tour existingTour, int inputMaxGroupSize) {
        List<TourStartDate> tourStartDates = existingTour.getTourStartDates();

        for (TourStartDate tourStartDate : tourStartDates) {
            Integer totalBookedSpaces = bookingRepository.sumParticipantsByTourStartDate(tourStartDate);
            if (totalBookedSpaces == null) {
                totalBookedSpaces = 0;
            }

            if (totalBookedSpaces > inputMaxGroupSize) {
                throw new IllegalArgumentException(
                        "The input maxGroupSize is too small. " +
                                "More than "+ inputMaxGroupSize + " participants have already booked the tour for certain dates.");
            }
        }
    }
}
