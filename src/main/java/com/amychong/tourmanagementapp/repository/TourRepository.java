package com.amychong.tourmanagementapp.repository;

import com.amychong.tourmanagementapp.entity.Tour;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TourRepository extends JpaRepository<Tour, Integer> {
}
