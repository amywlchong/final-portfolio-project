package com.amychong.tourmanagementapp.controller;

import com.amychong.tourmanagementapp.entity.Tour;
import com.amychong.tourmanagementapp.service.TourService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tours")
public class TourRestController extends GenericRestController<Tour, Tour> {
    private TourService tourService;

    @Autowired
    public TourRestController(TourService theTourService) {
        super(theTourService);
        tourService = theTourService;
    }

}
