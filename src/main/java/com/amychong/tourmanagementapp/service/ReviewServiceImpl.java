package com.amychong.tourmanagementapp.service;

import com.amychong.tourmanagementapp.dto.ReviewDTO;
import com.amychong.tourmanagementapp.entity.Review;
import com.amychong.tourmanagementapp.entity.Tour;
import com.amychong.tourmanagementapp.exception.NotFoundException;
import com.amychong.tourmanagementapp.mapper.ReviewMapper;
import com.amychong.tourmanagementapp.repository.BookingRepository;
import com.amychong.tourmanagementapp.repository.ReviewRepository;
import com.amychong.tourmanagementapp.repository.TourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewServiceImpl extends GenericServiceImpl<Review, ReviewDTO> implements ReviewService {

    private ReviewRepository reviewRepository;
    private ReviewMapper reviewMapper;
    private BookingRepository bookingRepository;
    private TourRepository tourRepository;

    @Autowired
    public ReviewServiceImpl(ReviewRepository theReviewRepository, ReviewMapper theReviewMapper, BookingRepository theBookingRepository, TourRepository theTourRepository) {
        super(theReviewRepository, theReviewMapper, Review.class, ReviewDTO.class);
        reviewRepository = theReviewRepository;
        reviewMapper = theReviewMapper;
        bookingRepository = theBookingRepository;
        tourRepository = theTourRepository;
    }

    @Override
    public List<ReviewDTO> findByUserId(Integer theUserId) {
        super.validateId(theUserId);

        List<Review> theReviews = reviewRepository.findByBooking_User_Id(theUserId);
        return reviewMapper.toDTOList(theReviews);
    }

    @Override
    public List<ReviewDTO> findByTourId(Integer theTourId) {
        super.validateId(theTourId);

        List<Review> theReviews = reviewRepository.findByBooking_TourStartDate_Tour_Id(theTourId);
        return reviewMapper.toDTOList(theReviews);
    }

    @Override
    @Transactional
    public ReviewDTO create(Review inputReview) {
        super.validateNotNull(inputReview, "Review must not be null.");
        super.validateNotNull(inputReview.getBooking(), "Booking must not be null.");
        if (!bookingRepository.existsById(inputReview.getBooking().getId())) {
            throw new NotFoundException("Booking not found. Review cannot be created without an associated booking.");
        }

        Review copyOfInputReview = inputReview.deepCopy();
        copyOfInputReview.setId(0);
        copyOfInputReview.setCreatedDate(LocalDate.now());
        Review dbReview = reviewRepository.save(copyOfInputReview);

        Tour associatedTour = dbReview.getBooking().getTourStartDate().getTour();
        updateTourRatingsAfterAddingReview(associatedTour.deepCopy(), dbReview.getRating());

        return reviewMapper.toDTO(dbReview);
    }

    @Override
    @Transactional
    public void deleteById(Integer inputReviewId) {
        validateId(inputReviewId);

        Optional<Review> dbReview = reviewRepository.findById(inputReviewId);
        if (!dbReview.isPresent()) {
            throw new NotFoundException("Did not find review id - " + inputReviewId);
        }
        Review reviewToBeDeleted = dbReview.get();

        Tour associatedTour = reviewToBeDeleted.getBooking().getTourStartDate().getTour();
        updateTourRatingsAfterDeletingReview(associatedTour.deepCopy(), reviewToBeDeleted.getRating());

        reviewRepository.deleteById(inputReviewId);
    }

    private void updateTourRatingsAfterAddingReview(Tour associatedTour, Integer newRating) {
        Float oldAverage = associatedTour.getRatingsAverage();
        int oldCount = associatedTour.getRatingsCount();

        if (oldAverage == null) {
            oldAverage = 0.0f;
        }

        Float newAverage = ((oldAverage * oldCount) + newRating) / (float) (oldCount + 1);

        associatedTour.setRatingsCount(oldCount + 1);
        associatedTour.setRatingsAverage(newAverage);

        tourRepository.save(associatedTour);
    }

    private void updateTourRatingsAfterDeletingReview(Tour associatedTour, Integer deletedRating) {
        Float oldAverage = associatedTour.getRatingsAverage();
        int oldCount = associatedTour.getRatingsCount();

        if (oldCount <= 1) {
            associatedTour.setRatingsCount(0);
            associatedTour.setRatingsAverage(null);
        } else {
            Float newAverage = ((oldAverage * oldCount) - deletedRating) / (float) (oldCount - 1);

            associatedTour.setRatingsCount(oldCount - 1);
            associatedTour.setRatingsAverage(newAverage);
        }

        tourRepository.save(associatedTour);
    }

}
