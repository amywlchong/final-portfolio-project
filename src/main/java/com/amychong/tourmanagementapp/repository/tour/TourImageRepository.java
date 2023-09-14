package com.amychong.tourmanagementapp.repository.tour;

import com.amychong.tourmanagementapp.entity.tour.TourImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TourImageRepository extends JpaRepository<TourImage, Integer> {

    Optional<TourImage> findByTour_IdAndName(Integer tourId, String imageName);
}
