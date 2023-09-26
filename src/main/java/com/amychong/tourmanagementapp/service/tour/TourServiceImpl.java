package com.amychong.tourmanagementapp.service.tour;

import com.amychong.tourmanagementapp.dto.tour.TourResponseDTO;
import com.amychong.tourmanagementapp.entity.tour.*;
import com.amychong.tourmanagementapp.mapper.TourMapper;
import com.amychong.tourmanagementapp.repository.booking.BookingRepository;
import com.amychong.tourmanagementapp.repository.tour.PointOfInterestRepository;
import com.amychong.tourmanagementapp.repository.tour.StartDateRepository;
import com.amychong.tourmanagementapp.repository.tour.TourImageRepository;
import com.amychong.tourmanagementapp.repository.tour.TourRepository;
import com.amychong.tourmanagementapp.service.EntityLookup;
import com.amychong.tourmanagementapp.service.S3.S3Service;
import com.amychong.tourmanagementapp.service.generic.GenericServiceImpl;
import com.amychong.tourmanagementapp.util.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

import static com.amychong.tourmanagementapp.service.S3.S3PathHelper.imagePath;

@Service
public class TourServiceImpl extends GenericServiceImpl<Tour, TourResponseDTO> implements TourService {

    private final TourRepository tourRepository;
    private final TourMapper tourMapper;
    private final EntityLookup entityLookup;
    private final TourImageRepository tourImageRepository;
    private final PointOfInterestRepository pointOfInterestRepository;
    private final StartDateRepository startDateRepository;
    private final BookingRepository bookingRepository;
    private final S3Service s3Service;

    @Autowired
    public TourServiceImpl(TourRepository theTourRepository, TourMapper theTourMapper, EntityLookup theEntityLookup, TourImageRepository theTourImageRepository, PointOfInterestRepository thePointOfInterestRepository, StartDateRepository theStartDateRepository, BookingRepository theBookingRepository, S3Service theS3Service) {

        super(theTourRepository, Tour.class, TourResponseDTO.class, theTourMapper);
        tourRepository = theTourRepository;
        tourMapper = theTourMapper;
        entityLookup = theEntityLookup;
        tourImageRepository = theTourImageRepository;
        pointOfInterestRepository = thePointOfInterestRepository;
        startDateRepository = theStartDateRepository;
        bookingRepository = theBookingRepository;
        s3Service = theS3Service;
    }

    @Override
    public TourResponseDTO findByIdOrThrow(Integer inputTourId) {
        TourResponseDTO dbTourDto = super.findByIdOrThrow(inputTourId);
        setAvailableSpaces(dbTourDto);
        return dbTourDto;
    }

    @Override
    public List<TourResponseDTO> findAvailableToursWithinRange(LocalDate startDate, LocalDate endDate) {
        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date cannot be after end date");
        }

        List<Tour> availableToursWithinRange = tourRepository.findAvailableToursWithinRange(startDate, endDate);
        return tourMapper.toDTOList(availableToursWithinRange);
    }

    @Override
    @Transactional
    public TourResponseDTO create(Tour inputTour) {
        Tour copyOfInputTour = inputTour.deepCopy();
        processTourPointsOfInterestForCreate(copyOfInputTour);
        processTourStartDatesForCreate(copyOfInputTour);
        return super.create(copyOfInputTour);
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
    public TourResponseDTO update(Integer inputTourId, Tour inputTour) {
        throw new UnsupportedOperationException("The generic update operation is not supported. Please use the specific update methods provided.");
    }

    @Override
    @Transactional
    public TourResponseDTO updateMainInfo(Integer inputTourId, Tour inputTour) {
        Tour existingTour = entityLookup.findTourByIdOrThrow(inputTourId);
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

    @Override
    @Transactional
    public void deleteById(Integer inputTourId) {
        List<TourImage> tourImagesToDelete = tourImageRepository.findByTour_Id(inputTourId);
        super.deleteById(inputTourId);

        List<String> keys = tourImagesToDelete.stream()
                .map(image -> imagePath(inputTourId, image.getName()))
                .collect(Collectors.toList());

        s3Service.deleteObjects(keys);
    }

    private void setAvailableSpaces(TourResponseDTO tour) {
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
