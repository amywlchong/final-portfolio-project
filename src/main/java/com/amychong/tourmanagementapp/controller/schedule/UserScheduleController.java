package com.amychong.tourmanagementapp.controller.schedule;

import com.amychong.tourmanagementapp.dto.TourGuideScheduleDTO;
import com.amychong.tourmanagementapp.service.schedule.TourGuideScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users/{userId}/schedules")
public class UserScheduleController {

    private final TourGuideScheduleService tourGuideScheduleService;

    @Autowired
    public UserScheduleController(TourGuideScheduleService theTourGuideScheduleService) {
        tourGuideScheduleService = theTourGuideScheduleService;
    }

    @PreAuthorize("hasAnyRole('GUIDE', 'LEAD_GUIDE','ADMIN')")
    @GetMapping
    public ResponseEntity<List<TourGuideScheduleDTO>> getByUserId(@PathVariable Integer userId) {
        List<TourGuideScheduleDTO> TourGuideScheduleDTOs = tourGuideScheduleService.findByUserId(userId);
        return new ResponseEntity<>(TourGuideScheduleDTOs, HttpStatus.OK);
    }
}

