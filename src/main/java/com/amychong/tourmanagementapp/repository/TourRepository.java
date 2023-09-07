package com.amychong.tourmanagementapp.repository;

import com.amychong.tourmanagementapp.entity.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface TourRepository extends JpaRepository<Tour, Integer> {

    @Query("SELECT t FROM Tour t JOIN FETCH t.tourImages WHERE t.id = :tourId")
    Optional<Tour> findByIdWithTourImages(@Param("tourId") Integer tourId);

    @Query("SELECT t FROM Tour t JOIN FETCH t.tourPointsOfInterest WHERE t.id = :tourId")
    Optional<Tour> findByIdWithTourPointsOfInterest(@Param("tourId") Integer tourId);

    @Query("SELECT t FROM Tour t JOIN FETCH t.tourStartDates WHERE t.id = :tourId")
    Optional<Tour> findByIdWithTourStartDates(@Param("tourId") Integer tourId);
}
