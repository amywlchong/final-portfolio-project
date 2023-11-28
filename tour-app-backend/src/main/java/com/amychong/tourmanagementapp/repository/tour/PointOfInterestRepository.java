package com.amychong.tourmanagementapp.repository.tour;

import com.amychong.tourmanagementapp.entity.tour.PointOfInterest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PointOfInterestRepository extends JpaRepository<PointOfInterest, Integer> {
  List<PointOfInterest> findAllByNameIn(Iterable<String> names);
}
