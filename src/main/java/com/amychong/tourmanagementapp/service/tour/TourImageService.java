package com.amychong.tourmanagementapp.service.tour;

import com.amychong.tourmanagementapp.entity.tour.TourImage;

import java.util.List;

public interface TourImageService {

    List<TourImage> updateTourImages(Integer theTourId, List<TourImage> theTourImages);
}
