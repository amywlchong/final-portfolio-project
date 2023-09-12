package com.amychong.tourmanagementapp.controller;

import com.amychong.tourmanagementapp.dto.ReviewDTO;
import com.amychong.tourmanagementapp.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users/{userId}/reviews")
public class UserReviewRestController {

    private ReviewService reviewService;

    @Autowired
    public UserReviewRestController(ReviewService theReviewService) {
        reviewService = theReviewService;
    }

    @GetMapping
    public ResponseEntity<List<ReviewDTO>> getByUserId(@PathVariable Integer userId) {
        List<ReviewDTO> reviewDTOs = reviewService.findByUserId(userId);
        return new ResponseEntity<>(reviewDTOs, HttpStatus.OK);
    }
}
