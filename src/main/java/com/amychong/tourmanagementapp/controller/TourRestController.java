package com.amychong.tourmanagementapp.controller;

import com.amychong.tourmanagementapp.entity.*;
import com.amychong.tourmanagementapp.service.TourService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tours")
public class TourRestController extends GenericRestController<Tour, Tour> {
    private TourService tourService;

    @Autowired
    public TourRestController(TourService theTourService) {
        super(theTourService);
        tourService = theTourService;
    }

    @PutMapping("/{tourId}")
    public ResponseEntity<Tour> updateMainInfo(@PathVariable int tourId, @RequestBody Tour tour) {
        Tour updatedTour = tourService.updateMainInfo(tourId, tour);
        return new ResponseEntity<>(updatedTour, HttpStatus.OK);
    }

    @PutMapping("/{tourId}/images")
    public ResponseEntity<List<TourImage>> updateImages(@PathVariable int tourId, @RequestBody Map<String, List<TourImage>> requestBody) {
        List<TourImage> updatedTourImages = tourService.updateTourImages(tourId, requestBody.get("tourImages"));
        return new ResponseEntity<>(updatedTourImages, HttpStatus.OK);
    }

    @PutMapping("/{tourId}/points-of-interest")
    public ResponseEntity<List<TourPointOfInterest>> updatePointsOfInterest(@PathVariable int tourId, @RequestBody Map<String, List<TourPointOfInterest>> requestBody) {
        List<TourPointOfInterest> updatedTourPOIs = tourService.updateTourPointsOfInterest(tourId, requestBody.get("tourPointsOfInterest"));
        return new ResponseEntity<>(updatedTourPOIs, HttpStatus.OK);
    }

    @PutMapping("/{tourId}/start-dates")
    public ResponseEntity<List<TourStartDate>> updateStartDates(@PathVariable int tourId, @RequestBody Map<String, List<TourStartDate>> requestBody) {
        List<TourStartDate> updatedTourStartDates = tourService.updateTourStartDates(tourId, requestBody.get("tourStartDates"));
        return new ResponseEntity<>(updatedTourStartDates, HttpStatus.OK);
    }

}
