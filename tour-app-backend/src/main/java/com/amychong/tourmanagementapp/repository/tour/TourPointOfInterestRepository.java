package com.amychong.tourmanagementapp.repository.tour;

import com.amychong.tourmanagementapp.entity.tour.TourPointOfInterest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TourPointOfInterestRepository extends JpaRepository<TourPointOfInterest, Integer> {

    Optional<TourPointOfInterest> findByTour_IdAndPointOfInterest_Name(Integer tourId, String pointOfInterestName);
}
