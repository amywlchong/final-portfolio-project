package com.amychong.tourmanagementapp.controller.review;

import com.amychong.tourmanagementapp.dto.review.ReviewResponseDTO;
import com.amychong.tourmanagementapp.service.review.ReviewService;
import jakarta.validation.constraints.Min;
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

  private final ReviewService reviewService;

  @Autowired
  public UserReviewController(ReviewService theReviewService) {
    reviewService = theReviewService;
  }

  @GetMapping
  public ResponseEntity<List<ReviewResponseDTO>> getByUserId(@Min(1) @PathVariable Integer userId) {
    List<ReviewResponseDTO> reviewDTOs = reviewService.findByUserId(userId);
    return new ResponseEntity<>(reviewDTOs, HttpStatus.OK);
  }
}
