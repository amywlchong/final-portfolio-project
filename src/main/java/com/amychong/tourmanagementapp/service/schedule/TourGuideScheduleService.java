package com.amychong.tourmanagementapp.service.schedule;

import com.amychong.tourmanagementapp.dto.TourGuideScheduleDTO;
import com.amychong.tourmanagementapp.entity.schedule.TourGuideSchedule;
import com.amychong.tourmanagementapp.service.generic.GenericService;

import java.time.LocalDate;
import java.util.List;

public interface TourGuideScheduleService extends GenericService<TourGuideSchedule, TourGuideScheduleDTO> {

    List<TourGuideScheduleDTO> findByUserId(Integer theUserId);

    List<TourGuideScheduleDTO> findByTourId(Integer theTourId);

    List<TourGuideScheduleDTO> findSchedulesWithinRange(LocalDate startDate, LocalDate endDate);
}
