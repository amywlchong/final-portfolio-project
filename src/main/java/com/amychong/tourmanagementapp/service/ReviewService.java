package com.amychong.tourmanagementapp.service;

import com.amychong.tourmanagementapp.dto.ReviewDTO;
import com.amychong.tourmanagementapp.entity.Review;

import java.util.List;

public interface ReviewService extends GenericService<Review, ReviewDTO> {

    List<ReviewDTO> findByUserId(Integer theUserId);

    List<ReviewDTO> findByTourId(Integer theTourId);
}
