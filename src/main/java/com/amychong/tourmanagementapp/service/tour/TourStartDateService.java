package com.amychong.tourmanagementapp.service.tour;

import com.amychong.tourmanagementapp.entity.tour.TourStartDate;

import java.time.LocalDateTime;
import java.util.List;

public interface TourStartDateService {

    TourStartDate validateTourStartDateAndFindFromDB(Integer tourId, LocalDateTime startDateTime);

    List<TourStartDate> updateTourStartDates(Integer inputTourId, List<TourStartDate> inputTourStartDates);

    void deleteTourStartDates(List<TourStartDate> existingDates, List<TourStartDate> updatedDates);
}
