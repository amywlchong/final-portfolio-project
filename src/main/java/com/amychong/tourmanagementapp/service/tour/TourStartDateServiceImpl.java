package com.amychong.tourmanagementapp.service.tour;

import com.amychong.tourmanagementapp.entity.tour.StartDate;
import com.amychong.tourmanagementapp.entity.tour.Tour;
import com.amychong.tourmanagementapp.entity.tour.TourStartDate;
import com.amychong.tourmanagementapp.exception.NotFoundException;
import com.amychong.tourmanagementapp.repository.tour.StartDateRepository;
import com.amychong.tourmanagementapp.repository.tour.TourStartDateRepository;
import com.amychong.tourmanagementapp.service.helper.ValidationHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TourStartDateServiceImpl implements TourStartDateService {

    private final TourStartDateRepository tourStartDateRepository;
    private final StartDateRepository startDateRepository;
    private final TourService tourService;

    @Autowired
    public TourStartDateServiceImpl(TourStartDateRepository theTourStartDateRepository, StartDateRepository theStartDateRepository, TourService theTourService) {
        tourStartDateRepository = theTourStartDateRepository;
        startDateRepository = theStartDateRepository;
        tourService = theTourService;
    }

    @Override
    public TourStartDate validateTourStartDateAndFindFromDB(Integer tourId, LocalDateTime startDateTime) {
        TourStartDate dbTourStartDate = tourStartDateRepository.findByTour_IdAndStartDate_StartDateTime(tourId, startDateTime)
                .orElseThrow(() -> new NotFoundException("You're referencing a tour-start date pair that does not exist - tourId: " + tourId + ", startDateTime: " + startDateTime));

        return dbTourStartDate;
    }

    @Override
    @Transactional
    public List<TourStartDate> updateTourStartDates(Integer inputTourId, List<TourStartDate> inputTourStartDates) {
        ValidationHelper.validateId(inputTourId);
        ValidationHelper.validateNotNull(inputTourStartDates, "Tour start dates must not be null.");

        TourUpdateProcessor<TourStartDate, StartDate, LocalDateTime> helper = new TourUpdateProcessor<>();
        helper.inputTourId = inputTourId;
        helper.findTourFunction = tourService::findByIdWithDetails;
        helper.inputTourRelatedEntities = inputTourStartDates;
        helper.findTourRelatedEntityFromDB = tourStartDateRepository::findByTour_IdAndStartDate_StartDateTime;
        helper.getEntitiesFromTourFunction = Tour::getTourStartDates;
        helper.addEntityToTourFunction = Tour::addTourStartDate;
        helper.getAssociatedEntityFunction = TourStartDate::getStartDate;
        helper.getUniqueFieldOfAssociatedEntityFunction = StartDate::getStartDateTime;
        helper.findExistingAssociatedEntitiesFunction = datetimes -> startDateRepository.findAllByStartDateTimeIn(datetimes);

        Tour processedTour = helper.processTourForUpdate();
        Tour existingTour = tourService.findById(inputTourId);

        deleteTourStartDates(existingTour.getTourStartDates(), processedTour.getTourStartDates());
        Tour processedTourWithSchedules = setSchedulesForUpdatedStartDates(existingTour, processedTour);

        return tourService.save(processedTourWithSchedules).getTourStartDates();
    }

    @Override
    @Transactional
    public void deleteTourStartDates(List<TourStartDate> existingDates, List<TourStartDate> updatedDates) {
        existingDates.stream()
                .filter(date -> !updatedDates.contains(date))
                .forEach(tourStartDateRepository::delete);
    }

    private Tour setSchedulesForUpdatedStartDates(Tour existingTour, Tour processedTour) {
        List<TourStartDate> existingTourStartDates = existingTour.getTourStartDates();
        List<TourStartDate> processedTourStartDates = processedTour.getTourStartDates();

        for (TourStartDate updatedTourStartDate : processedTourStartDates) {
            existingTourStartDates.stream()
                    .filter(existingDate -> existingDate.equals(updatedTourStartDate))
                    .findFirst()
                    .ifPresent(existingDate -> updatedTourStartDate.setTourGuideSchedules(existingDate.getTourGuideSchedules()));
        }

        return processedTour;
    }
}
