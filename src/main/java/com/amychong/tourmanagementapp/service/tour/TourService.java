package com.amychong.tourmanagementapp.service.tour;

import com.amychong.tourmanagementapp.entity.tour.Tour;
import com.amychong.tourmanagementapp.service.generic.GenericService;

import java.time.LocalDate;
import java.util.List;

public interface TourService extends GenericService<Tour, Tour> {

    Tour findByIdWithDetailsOrThrow(Integer tourId);

    List<Tour> findAvailableToursWithinRange(LocalDate startDate, LocalDate endDate);

    Tour save(Tour tour);

    Tour create(Tour inputTour);

    Tour update(Integer theTourId, Tour theTour);

    Tour updateMainInfo(Integer theTourId, Tour theTour);

    void updateTourRatingsAfterAddingReview(Tour associatedTour, Integer newRating);

    void updateTourRatingsAfterDeletingReview(Tour associatedTour, Integer deletedRating);
}
