package com.amychong.tourmanagementapp.controller.tour;

import com.amychong.tourmanagementapp.controller.generic.GenericController;
import com.amychong.tourmanagementapp.entity.tour.Tour;
import com.amychong.tourmanagementapp.entity.tour.TourImage;
import com.amychong.tourmanagementapp.entity.tour.TourPointOfInterest;
import com.amychong.tourmanagementapp.entity.tour.TourStartDate;
import com.amychong.tourmanagementapp.service.tour.TourImageService;
import com.amychong.tourmanagementapp.service.tour.TourPointOfInterestService;
import com.amychong.tourmanagementapp.service.tour.TourService;
import com.amychong.tourmanagementapp.service.tour.TourStartDateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tours")
public class TourController extends GenericController<Tour, Tour> {
    private final TourService tourService;
    private final TourImageService tourImageService;
    private final TourPointOfInterestService tourPointOfInterestService;
    private final TourStartDateService tourStartDateService;

    @Autowired
    public TourController(TourService theTourService, TourImageService theTourImageService, TourPointOfInterestService theTourPointOfInterestService, TourStartDateService theTourStartDateService) {
        super(theTourService);
        tourService = theTourService;
        tourImageService = theTourImageService;
        tourPointOfInterestService = theTourPointOfInterestService;
        tourStartDateService = theTourStartDateService;
    }

    @GetMapping("/available")
    public ResponseEntity<List<Tour>> getAvailableToursWithinRange(
            @RequestParam("startDate") LocalDate startDate,
            @RequestParam("endDate") LocalDate endDate) {

        List<Tour> availableTours = tourService.findAvailableToursWithinRange(startDate, endDate);

        return new ResponseEntity<>(availableTours, HttpStatus.OK);
    }

    @Override
    @PreAuthorize("hasAnyRole('LEAD_GUIDE','ADMIN')")
    @PostMapping
    public ResponseEntity<Tour> add(@RequestBody Tour tour) {
        return super.add(tour);
    }

    @PreAuthorize("hasAnyRole('LEAD_GUIDE','ADMIN')")
    @PutMapping("/{tourId}")
    public ResponseEntity<Tour> updateMainInfo(@PathVariable Integer tourId, @RequestBody Tour tour) {
        Tour updatedTour = tourService.updateMainInfo(tourId, tour);
        return new ResponseEntity<>(updatedTour, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('LEAD_GUIDE','ADMIN')")
    @PutMapping("/{tourId}/images")
    public ResponseEntity<List<TourImage>> updateImages(@PathVariable Integer tourId, @RequestBody Map<String, List<TourImage>> requestBody) {
        List<TourImage> updatedTourImages = tourImageService.updateTourImages(tourId, requestBody.get("tourImages"));
        return new ResponseEntity<>(updatedTourImages, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('LEAD_GUIDE','ADMIN')")
    @PutMapping("/{tourId}/points-of-interest")
    public ResponseEntity<List<TourPointOfInterest>> updatePointsOfInterest(@PathVariable Integer tourId, @RequestBody Map<String, List<TourPointOfInterest>> requestBody) {
        List<TourPointOfInterest> updatedTourPOIs = tourPointOfInterestService.updateTourPointsOfInterest(tourId, requestBody.get("tourPointsOfInterest"));
        return new ResponseEntity<>(updatedTourPOIs, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('LEAD_GUIDE','ADMIN')")
    @PutMapping("/{tourId}/start-dates")
    public ResponseEntity<List<TourStartDate>> updateStartDates(@PathVariable Integer tourId, @RequestBody Map<String, List<TourStartDate>> requestBody) {
        List<TourStartDate> updatedTourStartDates = tourStartDateService.updateTourStartDates(tourId, requestBody.get("tourStartDates"));
        return new ResponseEntity<>(updatedTourStartDates, HttpStatus.OK);
    }

    @Override
    @PreAuthorize("hasAnyRole('LEAD_GUIDE','ADMIN')")
    @DeleteMapping("/{tourId}")
    public ResponseEntity<String> delete(@PathVariable Integer tourId) {
        return super.delete(tourId);
    }
}
