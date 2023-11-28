package com.amychong.tourmanagementapp.service.tour;

import com.amychong.tourmanagementapp.entity.tour.TourPointOfInterest;

import java.util.List;

public interface TourPointOfInterestService {

  List<TourPointOfInterest> updateTourPointsOfInterest(
      Integer inputTourId, List<TourPointOfInterest> inputTourPointsOfInterest);
}
