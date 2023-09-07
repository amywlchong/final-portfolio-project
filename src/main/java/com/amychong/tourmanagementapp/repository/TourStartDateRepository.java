package com.amychong.tourmanagementapp.repository;

import com.amychong.tourmanagementapp.entity.TourStartDate;
import com.amychong.tourmanagementapp.entity.TourStartDateKey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface TourStartDateRepository extends JpaRepository<TourStartDate, TourStartDateKey> {
    TourStartDate findByTour_IdAndStartDate_StartDateTime(Integer tourId, LocalDateTime startDateTime);
}
