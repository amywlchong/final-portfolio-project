package com.amychong.tourmanagementapp.controller.schedule;

import com.amychong.tourmanagementapp.controller.generic.GenericController;
import com.amychong.tourmanagementapp.dto.TourGuideScheduleDTO;
import com.amychong.tourmanagementapp.entity.schedule.TourGuideSchedule;
import com.amychong.tourmanagementapp.entity.tour.Tour;
import com.amychong.tourmanagementapp.service.schedule.TourGuideScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/tour-guide-schedules")
public class TourGuideScheduleController extends GenericController<TourGuideSchedule, TourGuideScheduleDTO> {

    private final TourGuideScheduleService tourGuideScheduleService;

    @Autowired
    public TourGuideScheduleController(TourGuideScheduleService theTourGuideScheduleService) {
        super(theTourGuideScheduleService);
        tourGuideScheduleService = theTourGuideScheduleService;
    }

    @Override
    @PreAuthorize("hasAnyRole('GUIDE', 'LEAD_GUIDE','ADMIN')")
    @GetMapping
    public ResponseEntity<List<TourGuideScheduleDTO>> getAll() {
        return super.getAll();
    }

    @Override
    @PreAuthorize("hasAnyRole('GUIDE', 'LEAD_GUIDE','ADMIN')")
    @GetMapping("/{scheduleId}")
    public ResponseEntity<TourGuideScheduleDTO> getById(@PathVariable Integer scheduleId) {
        return super.getById(scheduleId);
    }

    @PreAuthorize("hasAnyRole('GUIDE', 'LEAD_GUIDE','ADMIN')")
    @GetMapping("/range")
    public ResponseEntity<List<TourGuideScheduleDTO>> getSchedulesWithinRange(
            @RequestParam("startDate") LocalDate startDate,
            @RequestParam("endDate") LocalDate endDate) {

        List<TourGuideScheduleDTO> tourGuideScheduleDTOS = tourGuideScheduleService.findSchedulesWithinRange(startDate, endDate);

        return new ResponseEntity<>(tourGuideScheduleDTOS, HttpStatus.OK);
    }

    @Override
    @PreAuthorize("hasAnyRole('LEAD_GUIDE','ADMIN')")
    @PostMapping
    public ResponseEntity<TourGuideScheduleDTO> add(@RequestBody TourGuideSchedule tourGuideSchedule) {
        return super.add(tourGuideSchedule);
    }

    @Override
    @PreAuthorize("hasAnyRole('LEAD_GUIDE','ADMIN')")
    @DeleteMapping("/{scheduleId}")
    public ResponseEntity<String> delete(@PathVariable Integer scheduleId) {
        return super.delete(scheduleId);
    }

}
