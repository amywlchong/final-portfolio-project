package com.amychong.tourmanagementapp.repository.tour;

import com.amychong.tourmanagementapp.entity.tour.TourStartDate;
import com.amychong.tourmanagementapp.entity.tour.TourStartDateKey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface TourStartDateRepository extends JpaRepository<TourStartDate, TourStartDateKey> {
    Optional<TourStartDate> findByTour_IdAndStartDate_StartDateTime(Integer tourId, LocalDateTime startDateTime);
}
