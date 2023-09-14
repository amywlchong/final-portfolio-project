package com.amychong.tourmanagementapp.controller.schedule;

import com.amychong.tourmanagementapp.controller.generic.GenericController;
import com.amychong.tourmanagementapp.dto.TourGuideScheduleDTO;
import com.amychong.tourmanagementapp.entity.schedule.TourGuideSchedule;
import com.amychong.tourmanagementapp.service.schedule.TourGuideScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tour-guide-schedules")
public class TourGuideScheduleController extends GenericController<TourGuideSchedule, TourGuideScheduleDTO> {

    private TourGuideScheduleService tourGuideScheduleService;

    @Autowired
    public TourGuideScheduleController(TourGuideScheduleService theTourGuideScheduleService) {
        super(theTourGuideScheduleService);
        tourGuideScheduleService = theTourGuideScheduleService;
    }

}
