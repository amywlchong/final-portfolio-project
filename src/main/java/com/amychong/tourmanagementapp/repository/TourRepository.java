package com.amychong.tourmanagementapp.repository;

import com.amychong.tourmanagementapp.entity.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TourRepository extends JpaRepository<Tour, Integer> {

    @Query("SELECT t FROM Tour t LEFT JOIN FETCH t.tourImages WHERE t.id = :tourId")
    Optional<Tour> findByIdWithTourImages(@Param("tourId") Integer tourId);

    @Query("SELECT t FROM Tour t LEFT JOIN FETCH t.tourPointsOfInterest WHERE t.id = :tourId")
    Optional<Tour> findByIdWithTourPointsOfInterest(@Param("tourId") Integer tourId);

    @Query("SELECT t FROM Tour t LEFT JOIN FETCH t.tourStartDates WHERE t.id = :tourId")
    Optional<Tour> findByIdWithTourStartDates(@Param("tourId") Integer tourId);

    @Query("SELECT t FROM Tour t " +
            "LEFT JOIN t.tourStartDates tsd " +
            "LEFT JOIN tsd.startDate sd " +
            "LEFT JOIN tsd.bookings b " +
            "WHERE DATE(sd.startDateTime) >= :startDate " +
            "AND ADDDATE(DATE(sd.startDateTime), (t.duration - 1)) <= :endDate " +
            "GROUP BY t.id, t.maxGroupSize " +
            "HAVING (t.maxGroupSize - COALESCE(SUM(b.numberOfParticipants), 0)) > 0")
    List<Tour> findAvailableToursWithinRange(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}
