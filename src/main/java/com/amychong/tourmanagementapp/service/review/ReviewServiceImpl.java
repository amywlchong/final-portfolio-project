package com.amychong.tourmanagementapp.service.review;

import com.amychong.tourmanagementapp.dto.review.ReviewRequestDTO;
import com.amychong.tourmanagementapp.dto.review.ReviewResponseDTO;
import com.amychong.tourmanagementapp.entity.booking.Booking;
import com.amychong.tourmanagementapp.entity.review.Review;
import com.amychong.tourmanagementapp.entity.tour.Tour;
import com.amychong.tourmanagementapp.entity.user.Role;
import com.amychong.tourmanagementapp.exception.NotFoundException;
import com.amychong.tourmanagementapp.exception.PermissionDeniedException;
import com.amychong.tourmanagementapp.mapper.ReviewMapper;
import com.amychong.tourmanagementapp.repository.booking.BookingRepository;
import com.amychong.tourmanagementapp.repository.review.ReviewRepository;
import com.amychong.tourmanagementapp.service.EntityLookup;
import com.amychong.tourmanagementapp.service.auth.AuthenticationService;
import com.amychong.tourmanagementapp.service.tour.TourService;
import com.amychong.tourmanagementapp.service.generic.GenericServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReviewServiceImpl extends GenericServiceImpl<Review, ReviewResponseDTO> implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;
    private final EntityLookup entityLookup;
    private final BookingRepository bookingRepository;
    private final TourService tourService;
    private final AuthenticationService authService;

    @Autowired
    public ReviewServiceImpl(ReviewRepository theReviewRepository, ReviewMapper theReviewMapper, EntityLookup theEntityLookup, BookingRepository theBookingRepository, TourService theTourService, AuthenticationService theAuthService) {
        super(theReviewRepository, Review.class, ReviewResponseDTO.class, theReviewMapper);
        reviewRepository = theReviewRepository;
        reviewMapper = theReviewMapper;
        entityLookup = theEntityLookup;
        bookingRepository = theBookingRepository;
        tourService = theTourService;
        authService = theAuthService;
    }

    @Override
    public List<ReviewResponseDTO> findByUserId(Integer theUserId) {
        List<Review> theReviews = reviewRepository.findByBooking_User_Id(theUserId);
        return reviewMapper.toDTOList(theReviews);
    }

    @Override
    public List<ReviewResponseDTO> findByTourId(Integer theTourId) {
        List<Review> theReviews = reviewRepository.findByBooking_TourStartDate_Tour_Id(theTourId);
        return reviewMapper.toDTOList(theReviews);
    }

    @Override
    @Transactional
    public ReviewResponseDTO create(ReviewRequestDTO inputReview) {
        Booking dbBooking = findBookingById(inputReview.getBookingId());
        validateUser(dbBooking.getUser().getId());

        Review reviewToBeAdded = reviewMapper.toReview(inputReview, entityLookup);
        reviewToBeAdded.setId(0);
        reviewToBeAdded.setCreatedDate(LocalDate.now());
        Review dbReview = reviewRepository.save(reviewToBeAdded);

        Tour associatedTour = dbReview.getBooking().getTourStartDate().getTour();
        tourService.updateTourRatingsAfterAddingReview(associatedTour.deepCopy(), dbReview.getRating());

        return reviewMapper.toDTO(dbReview);
    }

    @Override
    @Transactional
    public void deleteById(Integer inputReviewId) {
        Review reviewToBeDeleted = reviewRepository.findById(inputReviewId)
                .orElseThrow(() -> new NotFoundException("Did not find review id - " + inputReviewId));
        validateUser(reviewToBeDeleted.getBooking().getUser().getId());

        Tour associatedTour = reviewToBeDeleted.getBooking().getTourStartDate().getTour();
        tourService.updateTourRatingsAfterDeletingReview(associatedTour.deepCopy(), reviewToBeDeleted.getRating());

        reviewRepository.deleteById(inputReviewId);
    }

    private Booking findBookingById(Integer bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new NotFoundException("Did not find booking id: " + bookingId + ". Review cannot be created without an associated booking."));
    }

    private void validateUser(Integer userId) {
        if (authService.verifyAuthenticatedUserHasRole(Role.ROLE_CUSTOMER) && !authService.verifyAuthenticatedUserHasId(userId)) {
            throw new PermissionDeniedException("Customer can only create or delete reviews for their own bookings.");
        }
    }
}
