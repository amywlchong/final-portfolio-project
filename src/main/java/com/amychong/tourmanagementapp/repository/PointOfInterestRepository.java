package com.amychong.tourmanagementapp.repository;

import com.amychong.tourmanagementapp.entity.PointOfInterest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PointOfInterestRepository extends JpaRepository<PointOfInterest, Integer> {
    List<PointOfInterest> findAllByNameIn(Iterable<String> names);
}
