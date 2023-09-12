package com.amychong.tourmanagementapp.controller;

import com.amychong.tourmanagementapp.dto.ReviewDTO;
import com.amychong.tourmanagementapp.entity.Review;
import com.amychong.tourmanagementapp.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reviews")
public class ReviewRestController extends GenericRestController<Review, ReviewDTO> {

    private ReviewService reviewService;

    @Autowired
    public ReviewRestController(ReviewService theReviewService) {
        super(theReviewService);
        reviewService = theReviewService;
    }
}
