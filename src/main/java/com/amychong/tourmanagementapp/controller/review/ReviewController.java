package com.amychong.tourmanagementapp.controller.review;

import com.amychong.tourmanagementapp.controller.generic.GenericController;
import com.amychong.tourmanagementapp.dto.ReviewDTO;
import com.amychong.tourmanagementapp.entity.review.Review;
import com.amychong.tourmanagementapp.service.review.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController extends GenericController<Review, ReviewDTO> {

    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService theReviewService) {
        super(theReviewService);
        reviewService = theReviewService;
    }
}
