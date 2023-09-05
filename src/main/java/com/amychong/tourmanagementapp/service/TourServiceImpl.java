package com.amychong.tourmanagementapp.service;

import com.amychong.tourmanagementapp.entity.Tour;
import com.amychong.tourmanagementapp.entity.TourImage;
import com.amychong.tourmanagementapp.entity.TourPointOfInterest;
import com.amychong.tourmanagementapp.repository.TourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TourServiceImpl extends GenericServiceImpl<Tour, Tour> implements TourService {

    private TourRepository tourRepository;

    @Autowired
    public TourServiceImpl(TourRepository theTourRepository) {

        super(theTourRepository, Tour.class, Tour.class);
        tourRepository = theTourRepository;
    }

    @Override
    public List<Tour> findAll() {
        return super.findAll();
    }

    @Override
    public Tour findById(int theId) {
        return super.findById(theId);
    }


    @Override
    public Tour save(Tour theTour) {
        List<TourImage> images = theTour.getTourImages();
        List<TourPointOfInterest> tourPointsOfInterest = theTour.getTourPointsOfInterest();

        if (images != null) {
            for (TourImage image : images) {
                image.setTour(theTour);
            }
        }

        if (tourPointsOfInterest != null) {
            for (TourPointOfInterest tourPOI: tourPointsOfInterest) {
                tourPOI.setTour(theTour);
            }
        }

        return super.save(theTour);
    }

    @Override
    public void deleteById(int theId) {
        super.deleteById(theId);
    }

}
