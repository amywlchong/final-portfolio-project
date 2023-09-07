package com.amychong.tourmanagementapp.controller;

import com.amychong.tourmanagementapp.dto.TourGuideScheduleDTO;
import com.amychong.tourmanagementapp.entity.TourGuideSchedule;
import com.amychong.tourmanagementapp.service.TourGuideScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tour-guide-schedules")
public class TourGuideScheduleRestController extends GenericRestController<TourGuideSchedule, TourGuideScheduleDTO> {

    private TourGuideScheduleService tourGuideScheduleService;

    @Autowired
    public TourGuideScheduleRestController(TourGuideScheduleService theTourGuideScheduleService) {
        super(theTourGuideScheduleService);
        tourGuideScheduleService = theTourGuideScheduleService;
    }

}
