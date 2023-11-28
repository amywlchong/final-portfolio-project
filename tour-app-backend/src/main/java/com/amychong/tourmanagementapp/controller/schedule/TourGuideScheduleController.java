package com.amychong.tourmanagementapp.controller.schedule;

import com.amychong.tourmanagementapp.controller.generic.GenericController;
import com.amychong.tourmanagementapp.dto.schedule.ScheduleRequestDTO;
import com.amychong.tourmanagementapp.dto.schedule.ScheduleResponseDTO;
import com.amychong.tourmanagementapp.entity.schedule.TourGuideSchedule;
import com.amychong.tourmanagementapp.service.schedule.TourGuideScheduleService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/tour-guide-schedules")
public class TourGuideScheduleController extends GenericController<TourGuideSchedule, ScheduleResponseDTO> {

    private final TourGuideScheduleService tourGuideScheduleService;

    @Autowired
    public TourGuideScheduleController(TourGuideScheduleService theTourGuideScheduleService) {
        super(theTourGuideScheduleService);
        tourGuideScheduleService = theTourGuideScheduleService;
    }

    @Override
    @PreAuthorize("hasAnyRole('GUIDE', 'LEAD_GUIDE','ADMIN')")
    @GetMapping
    public ResponseEntity<List<ScheduleResponseDTO>> getAll() {
        return super.getAll();
    }

    @Override
    @PreAuthorize("hasAnyRole('GUIDE', 'LEAD_GUIDE','ADMIN')")
    @GetMapping("/{scheduleId}")
    public ResponseEntity<ScheduleResponseDTO> getById(@Min(1) @PathVariable Integer scheduleId) {
        return super.getById(scheduleId);
    }

    @PreAuthorize("hasAnyRole('GUIDE', 'LEAD_GUIDE','ADMIN')")
    @GetMapping("/range")
    public ResponseEntity<List<ScheduleResponseDTO>> getSchedulesWithinRange(
            @NotNull @RequestParam("startDate") LocalDate startDate,
            @NotNull @RequestParam("endDate") LocalDate endDate) {

        List<ScheduleResponseDTO> tourGuideScheduleDTOS = tourGuideScheduleService.findSchedulesWithinRange(startDate, endDate);

        return new ResponseEntity<>(tourGuideScheduleDTOS, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('LEAD_GUIDE','ADMIN')")
    @PostMapping
    public ResponseEntity<ScheduleResponseDTO> add(@NotNull @Valid @RequestBody ScheduleRequestDTO scheduleRequest) {
        ScheduleResponseDTO newSchedule = tourGuideScheduleService.create(scheduleRequest);
        return new ResponseEntity<>(newSchedule, HttpStatus.CREATED);
    }

    @Override
    @PreAuthorize("hasAnyRole('LEAD_GUIDE','ADMIN')")
    @DeleteMapping("/{scheduleId}")
    public ResponseEntity<String> delete(@Min(1) @PathVariable Integer scheduleId) {
        return super.delete(scheduleId);
    }

}
