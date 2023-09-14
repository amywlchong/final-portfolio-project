package com.amychong.tourmanagementapp.repository.review;

import com.amychong.tourmanagementapp.entity.review.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {

    List<Review> findByBooking_User_Id(Integer userId);

    List<Review> findByBooking_TourStartDate_Tour_Id(Integer tourId);

}
