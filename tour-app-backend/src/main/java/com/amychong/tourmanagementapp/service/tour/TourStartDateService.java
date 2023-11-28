package com.amychong.tourmanagementapp.service.tour;

import com.amychong.tourmanagementapp.entity.tour.TourStartDate;

import java.util.List;

public interface TourStartDateService {

  List<TourStartDate> updateTourStartDates(
      Integer inputTourId, List<TourStartDate> inputTourStartDates);

  void deleteTourStartDates(List<TourStartDate> existingDates, List<TourStartDate> updatedDates);
}
