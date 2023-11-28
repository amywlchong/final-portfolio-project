package com.amychong.tourmanagementapp.controller.tour;

import com.amychong.tourmanagementapp.controller.generic.GenericController;
import com.amychong.tourmanagementapp.dto.tour.TourResponseDTO;
import com.amychong.tourmanagementapp.entity.tour.Tour;
import com.amychong.tourmanagementapp.entity.tour.TourPointOfInterest;
import com.amychong.tourmanagementapp.entity.tour.TourStartDate;
import com.amychong.tourmanagementapp.service.tour.TourImageService;
import com.amychong.tourmanagementapp.service.tour.TourPointOfInterestService;
import com.amychong.tourmanagementapp.service.tour.TourService;
import com.amychong.tourmanagementapp.service.tour.TourStartDateService;
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
@RequestMapping("/api/tours")
public class TourController extends GenericController<Tour, TourResponseDTO> {
  private final TourService tourService;
  private final TourImageService tourImageService;
  private final TourPointOfInterestService tourPointOfInterestService;
  private final TourStartDateService tourStartDateService;

  @Autowired
  public TourController(
      TourService theTourService,
      TourImageService theTourImageService,
      TourPointOfInterestService theTourPointOfInterestService,
      TourStartDateService theTourStartDateService) {
    super(theTourService);
    tourService = theTourService;
    tourImageService = theTourImageService;
    tourPointOfInterestService = theTourPointOfInterestService;
    tourStartDateService = theTourStartDateService;
  }

  @GetMapping("/available")
  public ResponseEntity<List<TourResponseDTO>> getAvailableToursWithinRange(
      @NotNull @RequestParam("startDate") LocalDate startDate,
      @NotNull @RequestParam("endDate") LocalDate endDate) {

    List<TourResponseDTO> availableTours =
        tourService.findAvailableToursWithinRange(startDate, endDate);

    return new ResponseEntity<>(availableTours, HttpStatus.OK);
  }

  @PreAuthorize("hasAnyRole('LEAD_GUIDE','ADMIN')")
  @PostMapping
  public ResponseEntity<TourResponseDTO> add(@NotNull @Valid @RequestBody Tour tour) {
    TourResponseDTO newTour = tourService.create(tour);
    return new ResponseEntity<>(newTour, HttpStatus.CREATED);
  }

  @PreAuthorize("hasAnyRole('LEAD_GUIDE','ADMIN')")
  @PutMapping("/{tourId}")
  public ResponseEntity<TourResponseDTO> updateTour(
      @Min(1) @PathVariable Integer tourId, @NotNull @Valid @RequestBody Tour tour) {
    TourResponseDTO updatedTour = tourService.updateMainInfo(tourId, tour);
    List<TourPointOfInterest> updatedTourPOIs =
        tourPointOfInterestService.updateTourPointsOfInterest(
            tourId, tour.getTourPointsOfInterest());
    List<TourStartDate> updatedTourStartDates =
        tourStartDateService.updateTourStartDates(tourId, tour.getTourStartDates());
    updatedTour.setTourPointsOfInterest(updatedTourPOIs);
    updatedTour.setTourStartDates(updatedTourStartDates);
    return new ResponseEntity<>(updatedTour, HttpStatus.OK);
  }

  @PreAuthorize("hasAnyRole('LEAD_GUIDE','ADMIN')")
  @PutMapping("/{tourId}/points-of-interest")
  public ResponseEntity<List<TourPointOfInterest>> updatePointsOfInterest(
      @Min(1) @PathVariable Integer tourId,
      @NotNull @Valid @RequestBody List<TourPointOfInterest> tourPointsOfInterest) {
    List<TourPointOfInterest> updatedTourPOIs =
        tourPointOfInterestService.updateTourPointsOfInterest(tourId, tourPointsOfInterest);
    return new ResponseEntity<>(updatedTourPOIs, HttpStatus.OK);
  }

  @PreAuthorize("hasAnyRole('LEAD_GUIDE','ADMIN')")
  @PutMapping("/{tourId}/start-dates")
  public ResponseEntity<List<TourStartDate>> updateStartDates(
      @Min(1) @PathVariable Integer tourId,
      @NotNull @Valid @RequestBody List<TourStartDate> tourStartDates) {
    List<TourStartDate> updatedTourStartDates =
        tourStartDateService.updateTourStartDates(tourId, tourStartDates);
    return new ResponseEntity<>(updatedTourStartDates, HttpStatus.OK);
  }

  @Override
  @PreAuthorize("hasAnyRole('LEAD_GUIDE','ADMIN')")
  @DeleteMapping("/{tourId}")
  public ResponseEntity<String> delete(@Min(1) @PathVariable Integer tourId) {
    super.delete(tourId);
    return new ResponseEntity<>(
        "Successfully deleted tour id "
            + tourId
            + ", its associated images, "
            + "its relationships with points of interest, and its relationships with start dates.",
        HttpStatus.OK);
  }
}
