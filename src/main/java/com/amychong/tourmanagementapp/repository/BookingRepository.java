package com.amychong.tourmanagementapp.repository;

import com.amychong.tourmanagementapp.entity.Booking;
import com.amychong.tourmanagementapp.entity.TourStartDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Integer> {

    @Query("SELECT SUM(b.numberOfParticipants) FROM Booking b WHERE b.tourStartDate = :tourStartDate")
    Integer sumParticipantsByTourStartDate(@Param("tourStartDate") TourStartDate tourStartDate);

    List<Booking> findByUser_Id(Integer userId);

    List<Booking> findByTourStartDate_Tour_Id(Integer tourId);
}
