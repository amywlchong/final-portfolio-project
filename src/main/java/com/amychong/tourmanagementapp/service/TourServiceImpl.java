package com.amychong.tourmanagementapp.service;

import com.amychong.tourmanagementapp.entity.*;
import com.amychong.tourmanagementapp.repository.*;
import com.amychong.tourmanagementapp.util.CollectionUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TourServiceImpl extends GenericServiceImpl<Tour, Tour> implements TourService {

    private TourRepository tourRepository;
    private TourImageRepository tourImageRepository;
    private PointOfInterestRepository pointOfInterestRepository;
    private StartDateRepository startDateRepository;
    private TourStartDateRepository tourStartDateRepository;

    @Autowired
    public TourServiceImpl(TourRepository theTourRepository, TourImageRepository theTourImageRepository, PointOfInterestRepository thePointOfInterestRepository, StartDateRepository theStartDateRepository, TourStartDateRepository theTourStartDateRepository) {

        super(theTourRepository, Tour.class, Tour.class);
        tourRepository = theTourRepository;
        tourImageRepository = theTourImageRepository;
        pointOfInterestRepository = thePointOfInterestRepository;
        startDateRepository = theStartDateRepository;
        tourStartDateRepository = theTourStartDateRepository;
    }

    @Override
    @Transactional
    public Tour create(Tour inputTour) {
        super.validateNotNull(inputTour, "Tour must not be null.");

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
        List<PointOfInterest> existingPOIs = TourUpdateHelper.findExistingAssociatedEntitiesFromUniqueField(
                inputTourPointsOfInterest,
                TourPointOfInterest::getPointOfInterest,
                PointOfInterest::getName,
                names -> pointOfInterestRepository.findAllByNameIn(names)
        );

        inputTourPointsOfInterest.forEach(tourPOI -> {
            setPointOfInterestId(tourPOI, existingPOIs);
            tourPOI.setId(0);
            tourPOI.setTour(inputTour);
        });
    }

    private void processTourStartDatesForCreate(Tour inputTour) {
        List<TourStartDate> inputTourStartDates = CollectionUtils.nullToEmpty(inputTour.getTourStartDates());

        // get start dates that match the date-times of the input start dates from the database
        List<StartDate> existingStartDates = TourUpdateHelper.findExistingAssociatedEntitiesFromUniqueField(
                inputTourStartDates,
                TourStartDate::getStartDate,
                StartDate::getStartDateTime,
                dateTimes -> startDateRepository.findAllByStartDateTimeIn(dateTimes)
        );

        inputTourStartDates.forEach(tourStartDate -> {
            setStartDateId(tourStartDate, existingStartDates);
            tourStartDate.setId(new TourStartDateKey(0, 0));
            tourStartDate.setTour(inputTour);
        });
    }

    @Override
    public Tour update(int inputTourId, Tour inputTour) {
        throw new UnsupportedOperationException("The generic update operation is not supported. Please use the specific update methods provided.");
    }

    @Override
    @Transactional
    public Tour updateMainInfo(int inputTourId, Tour inputTour) {
        super.validateNotNull(inputTour, "Tour must not be null.");

        Tour existingTour = findById(inputTourId);
        Tour copyOfExistingTour = existingTour.deepCopy();
        copyOfExistingTour.setMainFields(inputTour);

        return super.save(copyOfExistingTour);
    }

    @Override
    @Transactional
    public List<TourImage> updateTourImages(int inputTourId, List<TourImage> inputTourImages) {
        super.validateId(inputTourId);
        super.validateNotNull(inputTourImages, "Tour images must not be null.");

        TourUpdateHelper<TourImage, TourImage, String> helper = new TourUpdateHelper<>();
        helper.inputTourId = inputTourId;
        helper.fetchTourFunction = tourRepository::findByIdWithTourImages;
        helper.inputTourRelatedEntities = inputTourImages;
        helper.deepCopyFunction = images -> images.stream()
                .map(TourImage::deepCopy)
                .map(image -> image.withPrependedTourId(inputTourId))
                .collect(Collectors.toList());
        helper.getEntitiesFromTourFunction = Tour::getTourImages;
        helper.addEntityToTourFunction = Tour::addTourImage;
        helper.getAssociatedEntityFunction = TourImage::getThis;
        helper.getUniqueFieldOfAssociatedEntityFunction = TourImage::getName;
        helper.findExistingAssociatedEntitiesFunction = names -> tourImageRepository.findAllByNameIn(names);
        helper.setIdOfAssociatedEntityFunction = this::setTourImageId;

        Tour processedTour = helper.processTourForUpdate().getRight();

        return helper.getEntitiesFromTourFunction.apply(super.save(processedTour));
    }

    @Override
    @Transactional
    public List<TourPointOfInterest> updateTourPointsOfInterest(int inputTourId, List<TourPointOfInterest> inputTourPointsOfInterest) {
        super.validateId(inputTourId);
        super.validateNotNull(inputTourPointsOfInterest, "Tour points of interest must not be null.");

        TourUpdateHelper<TourPointOfInterest, PointOfInterest, String> helper = new TourUpdateHelper<>();
        helper.inputTourId = inputTourId;
        helper.fetchTourFunction = tourRepository::findByIdWithTourPointsOfInterest;
        helper.inputTourRelatedEntities = inputTourPointsOfInterest;
        helper.deepCopyFunction = tourPOIs -> tourPOIs.stream()
                .map(TourPointOfInterest::deepCopy)
                .collect(Collectors.toList());
        helper.getEntitiesFromTourFunction = Tour::getTourPointsOfInterest;
        helper.addEntityToTourFunction = Tour::addTourPointOfInterest;
        helper.getAssociatedEntityFunction = TourPointOfInterest::getPointOfInterest;
        helper.getUniqueFieldOfAssociatedEntityFunction = PointOfInterest::getName;
        helper.findExistingAssociatedEntitiesFunction = names -> pointOfInterestRepository.findAllByNameIn(names);
        helper.setIdOfAssociatedEntityFunction = this::setPointOfInterestId;

        Tour processedTour = helper.processTourForUpdate().getRight();

        return helper.getEntitiesFromTourFunction.apply(super.save(processedTour));
    }

    @Override
    @Transactional
    public List<TourStartDate> updateTourStartDates(int inputTourId, List<TourStartDate> inputTourStartDates) {
        super.validateId(inputTourId);
        super.validateNotNull(inputTourStartDates, "Tour start dates must not be null.");

        TourUpdateHelper<TourStartDate, StartDate, LocalDateTime> helper = new TourUpdateHelper<>();
        helper.inputTourId = inputTourId;
        helper.fetchTourFunction = tourRepository::findByIdWithTourStartDates;
        helper.inputTourRelatedEntities = inputTourStartDates;
        helper.deepCopyFunction = tourStartDates -> tourStartDates.stream()
                .map(TourStartDate::deepCopy)
                .collect(Collectors.toList());
        helper.getEntitiesFromTourFunction = Tour::getTourStartDates;
        helper.addEntityToTourFunction = Tour::addTourStartDate;
        helper.getAssociatedEntityFunction = TourStartDate::getStartDate;
        helper.getUniqueFieldOfAssociatedEntityFunction = StartDate::getStartDateTime;
        helper.findExistingAssociatedEntitiesFunction = datetimes -> startDateRepository.findAllByStartDateTimeIn(datetimes);
        helper.setIdOfAssociatedEntityFunction = this::setStartDateId;

        Pair<Tour, Tour> tourPair = helper.processTourForUpdate();
        // tourPair: left is original existing tour, right is processed tour
        Tour processedTour = syncTourGuideSchedules(tourPair.getLeft(), tourPair.getRight());

        return helper.getEntitiesFromTourFunction.apply(super.save(processedTour));
    }

    protected Tour syncTourGuideSchedules(Tour existingTour, Tour processedTour) {
        List<TourStartDate> existingTourStartDates = existingTour.getTourStartDates();
        List<TourStartDate> updatedTourStartDates = processedTour.getTourStartDates();

        handleRemovedStartDates(existingTourStartDates, updatedTourStartDates);
        updateTourGuideSchedules(existingTourStartDates, updatedTourStartDates);

        return processedTour;
    }

    private void handleRemovedStartDates(List<TourStartDate> existingDates, List<TourStartDate> updatedDates) {
        existingDates.stream()
                .filter(date -> !updatedDates.contains(date))
                .forEach(tourStartDateRepository::delete);
    }

    private void updateTourGuideSchedules(List<TourStartDate> existingDates, List<TourStartDate> updatedDates) {
        for (TourStartDate updatedTourStartDate : updatedDates) {
            existingDates.stream()
                    .filter(existingDate -> existingDate.equals(updatedTourStartDate))
                    .findFirst()
                    .ifPresent(existingDate -> updatedTourStartDate.setTourGuideSchedules(existingDate.getTourGuideSchedules()));
        }
    }

    private void setTourImageId(TourImage inputImage, List<TourImage> existingTourImages) {
        TourUpdateHelper.setEntityId(inputImage.getThis(), existingTourImages);
    }

    private void setPointOfInterestId(TourPointOfInterest inputTourPOI, List<PointOfInterest> existingPOIs) {
        TourUpdateHelper.setEntityId(inputTourPOI.getPointOfInterest(), existingPOIs);
    }

    private void setStartDateId(TourStartDate inputTourStartDate, List<StartDate> existingStartDates) {
        TourUpdateHelper.setEntityId(inputTourStartDate.getStartDate(), existingStartDates);
    }
}
