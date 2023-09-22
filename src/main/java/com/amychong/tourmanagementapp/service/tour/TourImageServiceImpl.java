package com.amychong.tourmanagementapp.service.tour;

import com.amychong.tourmanagementapp.entity.tour.Tour;
import com.amychong.tourmanagementapp.entity.tour.TourImage;
import com.amychong.tourmanagementapp.repository.tour.TourImageRepository;
import com.amychong.tourmanagementapp.repository.tour.TourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class TourImageServiceImpl implements TourImageService{

    private final TourImageRepository tourImageRepository;
    private final TourService tourService;

    @Autowired
    public TourImageServiceImpl(TourImageRepository theTourImageRepository, TourRepository theTourRepository, TourService theTourService) {
        tourImageRepository = theTourImageRepository;
        tourService = theTourService;
    }

    @Override
    @Transactional
    public List<TourImage> updateTourImages(Integer inputTourId, List<TourImage> inputTourImages) {

        Tour existingTour = tourService.findByIdWithDetailsOrThrow(inputTourId);
        Tour copyOfExistingTour = existingTour.deepCopy();

        List<TourImage> imagesOfExistingTour = copyOfExistingTour.getTourImages();
        imagesOfExistingTour.clear();

        for (TourImage inputTourImage : inputTourImages) {
            Optional<TourImage> dbTourImage = tourImageRepository.findByTour_IdAndName(inputTourId, inputTourImage.getName());

            if (dbTourImage.isPresent()) {
                inputTourImage.setId(dbTourImage.get().getId());
            } else {
                TourUpdateProcessor.resetId(inputTourImage);
            }

            copyOfExistingTour.addTourImage(inputTourImage);
        }
        return tourService.save(copyOfExistingTour).getTourImages();
    }
}
