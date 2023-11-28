package com.amychong.tourmanagementapp.controller.schedule;

import com.amychong.tourmanagementapp.dto.schedule.ScheduleResponseDTO;
import com.amychong.tourmanagementapp.service.schedule.TourGuideScheduleService;
import jakarta.validation.constraints.Min;
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
@RequestMapping("/api/tours/{tourId}/schedules")
public class TourScheduleController {

  private final TourGuideScheduleService tourGuideScheduleService;

  @Autowired
  public TourScheduleController(TourGuideScheduleService theTourGuideScheduleService) {
    tourGuideScheduleService = theTourGuideScheduleService;
  }

  @PreAuthorize("hasAnyRole('GUIDE', 'LEAD_GUIDE','ADMIN')")
  @GetMapping
  public ResponseEntity<List<ScheduleResponseDTO>> getByTourId(
      @Min(1) @PathVariable Integer tourId) {
    List<ScheduleResponseDTO> TourGuideScheduleDTOs = tourGuideScheduleService.findByTourId(tourId);
    return new ResponseEntity<>(TourGuideScheduleDTOs, HttpStatus.OK);
  }
}
