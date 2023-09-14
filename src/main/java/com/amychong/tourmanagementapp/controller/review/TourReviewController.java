package com.amychong.tourmanagementapp.controller.review;

import com.amychong.tourmanagementapp.dto.ReviewDTO;
import com.amychong.tourmanagementapp.service.review.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tours/{tourId}/reviews")
public class TourReviewController {

    private ReviewService reviewService;

    @Autowired
    public TourReviewController(ReviewService theReviewService) {
        reviewService = theReviewService;
    }

    @GetMapping
    public ResponseEntity<List<ReviewDTO>> getByTourId(@PathVariable Integer tourId) {
        List<ReviewDTO> reviewDTOs = reviewService.findByTourId(tourId);
        return new ResponseEntity<>(reviewDTOs, HttpStatus.OK);
    }
}
