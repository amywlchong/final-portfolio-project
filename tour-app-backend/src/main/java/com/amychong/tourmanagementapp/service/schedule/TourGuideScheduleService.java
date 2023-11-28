package com.amychong.tourmanagementapp.service.schedule;

import com.amychong.tourmanagementapp.dto.schedule.ScheduleRequestDTO;
import com.amychong.tourmanagementapp.dto.schedule.ScheduleResponseDTO;
import com.amychong.tourmanagementapp.entity.schedule.TourGuideSchedule;
import com.amychong.tourmanagementapp.service.generic.GenericService;

import java.time.LocalDate;
import java.util.List;

public interface TourGuideScheduleService extends GenericService<TourGuideSchedule, ScheduleResponseDTO> {

    List<ScheduleResponseDTO> findByUserId(Integer theUserId);

    List<ScheduleResponseDTO> findByTourId(Integer theTourId);

    List<ScheduleResponseDTO> findSchedulesWithinRange(LocalDate startDate, LocalDate endDate);

    ScheduleResponseDTO create(ScheduleRequestDTO inputTourGuideSchedule);
}
