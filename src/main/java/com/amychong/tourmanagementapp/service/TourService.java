package com.amychong.tourmanagementapp.service;

import com.amychong.tourmanagementapp.entity.Tour;
import com.amychong.tourmanagementapp.entity.TourImage;
import com.amychong.tourmanagementapp.entity.TourPointOfInterest;
import com.amychong.tourmanagementapp.entity.TourStartDate;

import java.time.LocalDate;
import java.util.List;

public interface TourService extends GenericService<Tour, Tour> {

    List<Tour> findAvailableToursWithinRange(LocalDate startDate, LocalDate endDate);

    Tour update(Integer theTourId, Tour theTour);

    Tour updateMainInfo(Integer theTourId, Tour theTour);

    List<TourImage> updateTourImages(Integer theTourId, List<TourImage> theTourImages);

    List<TourPointOfInterest> updateTourPointsOfInterest(Integer theTourId, List<TourPointOfInterest> theTourPointsOfInterest);

    List<TourStartDate> updateTourStartDates(Integer theTourId, List<TourStartDate> theTourStartDates);
}
