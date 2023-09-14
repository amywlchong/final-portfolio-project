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
@RequestMapping("/api/users/{userId}/reviews")
public class UserReviewController {

    private ReviewService reviewService;

    @Autowired
    public UserReviewController(ReviewService theReviewService) {
        reviewService = theReviewService;
    }

    @GetMapping
    public ResponseEntity<List<ReviewDTO>> getByUserId(@PathVariable Integer userId) {
        List<ReviewDTO> reviewDTOs = reviewService.findByUserId(userId);
        return new ResponseEntity<>(reviewDTOs, HttpStatus.OK);
    }
}
