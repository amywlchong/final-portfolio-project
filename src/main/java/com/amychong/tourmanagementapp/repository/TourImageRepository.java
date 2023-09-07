package com.amychong.tourmanagementapp.repository;

import com.amychong.tourmanagementapp.entity.TourImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TourImageRepository extends JpaRepository<TourImage, Integer> {

    List<TourImage> findAllByNameIn(Iterable<String> names);
}
