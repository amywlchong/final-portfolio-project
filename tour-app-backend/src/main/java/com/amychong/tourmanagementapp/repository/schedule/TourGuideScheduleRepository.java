package com.amychong.tourmanagementapp.repository.schedule;

import com.amychong.tourmanagementapp.dto.schedule.ScheduleResponseDTO;
import com.amychong.tourmanagementapp.entity.schedule.TourGuideSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface TourGuideScheduleRepository extends JpaRepository<TourGuideSchedule, Integer> {

  @Query(
      "SELECT new com.amychong.tourmanagementapp.dto.schedule.ScheduleResponseDTO("
          + "tgs.id, "
          + "u.id, u.name, u.active, u.role, "
          + "t.id, t.name, t.duration, t.region, "
          + "sd.id, sd.startDateTime) "
          + "FROM TourStartDate tsd "
          + "LEFT JOIN tsd.tour t "
          + "LEFT JOIN tsd.startDate sd "
          + "LEFT JOIN tsd.tourGuideSchedules tgs "
          + "LEFT JOIN tgs.user u "
          + "ORDER BY tgs.id")
  List<ScheduleResponseDTO> findAllDTO();

  @Query(
      "SELECT new com.amychong.tourmanagementapp.dto.schedule.ScheduleResponseDTO("
          + "tgs.id, "
          + "u.id, u.name, u.active, u.role, "
          + "t.id, t.name, t.duration, t.region, "
          + "sd.id, sd.startDateTime) "
          + "FROM TourStartDate tsd "
          + "LEFT JOIN tsd.tour t "
          + "LEFT JOIN tsd.startDate sd "
          + "LEFT JOIN tsd.tourGuideSchedules tgs "
          + "LEFT JOIN tgs.user u "
          + "WHERE u.id = :userId "
          + "ORDER BY tgs.id")
  List<ScheduleResponseDTO> findByUserId(@Param("userId") Integer userId);

  @Query(
      "SELECT new com.amychong.tourmanagementapp.dto.schedule.ScheduleResponseDTO("
          + "tgs.id, "
          + "u.id, u.name, u.active, u.role, "
          + "t.id, t.name, t.duration, t.region, "
          + "sd.id, sd.startDateTime) "
          + "FROM TourStartDate tsd "
          + "LEFT JOIN tsd.tour t "
          + "LEFT JOIN tsd.startDate sd "
          + "LEFT JOIN tsd.tourGuideSchedules tgs "
          + "LEFT JOIN tgs.user u "
          + "WHERE t.id = :tourId "
          + "ORDER BY tgs.id")
  List<ScheduleResponseDTO> findByTourId(@Param("tourId") Integer tourId);

  @Query(
      "SELECT new com.amychong.tourmanagementapp.dto.schedule.ScheduleResponseDTO("
          + "tgs.id, "
          + "u.id, u.name, u.active, u.role, "
          + "t.id, t.name, t.duration, t.region, "
          + "sd.id, sd.startDateTime) "
          + "FROM TourStartDate tsd "
          + "LEFT JOIN tsd.tour t "
          + "LEFT JOIN tsd.startDate sd "
          + "LEFT JOIN tsd.tourGuideSchedules tgs "
          + "LEFT JOIN tgs.user u "
          + "WHERE DATE(sd.startDateTime) >= :startDate "
          + "AND ADDDATE(DATE(sd.startDateTime), (t.duration - 1)) <= :endDate "
          + "ORDER BY tgs.id")
  List<ScheduleResponseDTO> findSchedulesWithinRange(
      @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
