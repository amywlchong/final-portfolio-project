package com.amychong.tourmanagementapp.repository.tour;

import com.amychong.tourmanagementapp.entity.tour.StartDate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface StartDateRepository extends JpaRepository<StartDate, Integer> {

  List<StartDate> findAllByStartDateTimeIn(Iterable<LocalDateTime> startDateTimes);
}
