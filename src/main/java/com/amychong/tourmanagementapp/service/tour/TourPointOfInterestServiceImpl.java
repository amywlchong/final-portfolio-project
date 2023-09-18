package com.amychong.tourmanagementapp.service.tour;

import com.amychong.tourmanagementapp.entity.tour.PointOfInterest;
import com.amychong.tourmanagementapp.entity.tour.Tour;
import com.amychong.tourmanagementapp.entity.tour.TourPointOfInterest;
import com.amychong.tourmanagementapp.repository.tour.PointOfInterestRepository;
import com.amychong.tourmanagementapp.repository.tour.TourPointOfInterestRepository;
import com.amychong.tourmanagementapp.service.helper.ValidationHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TourPointOfInterestServiceImpl implements TourPointOfInterestService{

    private final PointOfInterestRepository pointOfInterestRepository;
    private final TourPointOfInterestRepository tourPointOfInterestRepository;
    private final TourService tourService;

    @Autowired
    public TourPointOfInterestServiceImpl(PointOfInterestRepository thePointOfInterestRepository, TourPointOfInterestRepository theTourPointOfInterestRepository, TourService theTourService) {
        pointOfInterestRepository = thePointOfInterestRepository;
        tourPointOfInterestRepository = theTourPointOfInterestRepository;
        tourService = theTourService;
    }

    @Override
    @Transactional
    public List<TourPointOfInterest> updateTourPointsOfInterest(Integer inputTourId, List<TourPointOfInterest> inputTourPointsOfInterest) {
        ValidationHelper.validateId(inputTourId);
        ValidationHelper.validateNotNull(inputTourPointsOfInterest, "Tour points of interest must not be null.");

        TourUpdateProcessor<TourPointOfInterest, PointOfInterest, String> helper = new TourUpdateProcessor<>();
        helper.inputTourId = inputTourId;
        helper.findTourFunction = tourService::findByIdWithDetails;
        helper.inputTourRelatedEntities = inputTourPointsOfInterest;
        helper.findTourRelatedEntityFromDB = tourPointOfInterestRepository::findByTour_IdAndPointOfInterest_Name;
        helper.getEntitiesFromTourFunction = Tour::getTourPointsOfInterest;
        helper.addEntityToTourFunction = Tour::addTourPointOfInterest;
        helper.getAssociatedEntityFunction = TourPointOfInterest::getPointOfInterest;
        helper.getUniqueFieldOfAssociatedEntityFunction = PointOfInterest::getName;
        helper.findExistingAssociatedEntitiesFunction = names -> pointOfInterestRepository.findAllByNameIn(names);

        Tour processedTour = helper.processTourForUpdate();

        return tourService.save(processedTour).getTourPointsOfInterest();
    }
}
