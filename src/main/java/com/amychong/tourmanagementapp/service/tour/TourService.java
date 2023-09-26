package com.amychong.tourmanagementapp.service.tour;

import com.amychong.tourmanagementapp.dto.tour.TourResponseDTO;
import com.amychong.tourmanagementapp.entity.tour.Tour;
import com.amychong.tourmanagementapp.service.generic.GenericService;

import java.time.LocalDate;
import java.util.List;

public interface TourService extends GenericService<Tour, TourResponseDTO> {

    List<TourResponseDTO> findAvailableToursWithinRange(LocalDate startDate, LocalDate endDate);

    TourResponseDTO create(Tour inputTour);

    TourResponseDTO update(Integer theTourId, Tour theTour);

    TourResponseDTO updateMainInfo(Integer theTourId, Tour theTour);

    void updateTourRatingsAfterAddingReview(Tour associatedTour, Integer newRating);

    void updateTourRatingsAfterDeletingReview(Tour associatedTour, Integer deletedRating);
}
