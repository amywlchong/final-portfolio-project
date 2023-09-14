package com.amychong.tourmanagementapp.service.review;

import com.amychong.tourmanagementapp.dto.ReviewDTO;
import com.amychong.tourmanagementapp.entity.review.Review;
import com.amychong.tourmanagementapp.service.generic.GenericService;

import java.util.List;

public interface ReviewService extends GenericService<Review, ReviewDTO> {

    List<ReviewDTO> findByUserId(Integer theUserId);

    List<ReviewDTO> findByTourId(Integer theTourId);
}
