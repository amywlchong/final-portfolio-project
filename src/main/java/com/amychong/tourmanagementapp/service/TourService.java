package com.amychong.tourmanagementapp.service;

import com.amychong.tourmanagementapp.entity.Tour;
import com.amychong.tourmanagementapp.entity.TourImage;
import com.amychong.tourmanagementapp.entity.TourPointOfInterest;
import com.amychong.tourmanagementapp.entity.TourStartDate;

import java.util.List;

public interface TourService extends GenericService<Tour, Tour> {

    Tour update(int theId, Tour theTour);

    Tour updateMainInfo(int theTourId, Tour theTour);

    List<TourImage> updateTourImages(int theTourId, List<TourImage> theTourImages);

    List<TourPointOfInterest> updateTourPointsOfInterest(int theTourId, List<TourPointOfInterest> theTourPointsOfInterest);

    List<TourStartDate> updateTourStartDates(int theTourId, List<TourStartDate> theTourStartDates);
}
