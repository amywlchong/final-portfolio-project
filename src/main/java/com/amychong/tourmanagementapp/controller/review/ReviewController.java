package com.amychong.tourmanagementapp.controller.review;

import com.amychong.tourmanagementapp.controller.generic.GenericController;
import com.amychong.tourmanagementapp.dto.review.ReviewRequestDTO;
import com.amychong.tourmanagementapp.dto.review.ReviewResponseDTO;
import com.amychong.tourmanagementapp.entity.review.Review;
import com.amychong.tourmanagementapp.service.review.ReviewService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController extends GenericController<Review, ReviewResponseDTO> {

    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService theReviewService) {
        super(theReviewService);
        reviewService = theReviewService;
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping
    public ResponseEntity<ReviewResponseDTO> add(@NotNull @Valid @RequestBody ReviewRequestDTO reviewRequest) {
        ReviewResponseDTO newReview = reviewService.create(reviewRequest);
        return new ResponseEntity<>(newReview, HttpStatus.CREATED);
    }

    @Override
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<String> delete(@Min(1) @PathVariable Integer reviewId) {
        return super.delete(reviewId);
    }
}
