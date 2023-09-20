package com.amychong.tourmanagementapp.controller.review;

import com.amychong.tourmanagementapp.controller.generic.GenericController;
import com.amychong.tourmanagementapp.dto.ReviewDTO;
import com.amychong.tourmanagementapp.entity.review.Review;
import com.amychong.tourmanagementapp.service.review.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController extends GenericController<Review, ReviewDTO> {

    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService theReviewService) {
        super(theReviewService);
        reviewService = theReviewService;
    }

    @Override
    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping
    public ResponseEntity<ReviewDTO> add(@RequestBody Review review) {
        return super.add(review);
    }

    @Override
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<String> delete(@PathVariable Integer reviewId) {
        return super.delete(reviewId);
    }
}
