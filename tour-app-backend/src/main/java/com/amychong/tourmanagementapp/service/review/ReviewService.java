package com.amychong.tourmanagementapp.service.review;

import com.amychong.tourmanagementapp.dto.review.ReviewRequestDTO;
import com.amychong.tourmanagementapp.dto.review.ReviewResponseDTO;
import com.amychong.tourmanagementapp.entity.review.Review;
import com.amychong.tourmanagementapp.service.generic.GenericService;

import java.util.List;

public interface ReviewService extends GenericService<Review, ReviewResponseDTO> {

  List<ReviewResponseDTO> findByUserId(Integer theUserId);

  List<ReviewResponseDTO> findByTourId(Integer theTourId);

  ReviewResponseDTO create(ReviewRequestDTO inputReview);
}
