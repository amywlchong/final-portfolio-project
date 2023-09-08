package com.amychong.tourmanagementapp.repository;

import com.amychong.tourmanagementapp.dto.TourGuideScheduleDTO;
import com.amychong.tourmanagementapp.entity.TourGuideSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TourGuideScheduleRepository extends JpaRepository<TourGuideSchedule, Integer> {

    @Query("SELECT new com.amychong.tourmanagementapp.dto.TourGuideScheduleDTO(" +
            "tgs.id, " +
            "u.id, u.name, u.active, ur.role, " +
            "t.id, t.name, t.duration, t.region, " +
            "sd.id, sd.startDateTime) " +
            "FROM TourStartDate tsd " +
            "LEFT JOIN tsd.tour t " +
            "LEFT JOIN tsd.startDate sd " +
            "LEFT JOIN tsd.tourGuideSchedules tgs " +
            "LEFT JOIN tgs.user u " +
            "LEFT JOIN u.userRole ur " +
            "ORDER BY tgs.id")
    List<TourGuideScheduleDTO> findAllDTO();

}
