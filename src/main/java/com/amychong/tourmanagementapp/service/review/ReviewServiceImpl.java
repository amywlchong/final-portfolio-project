package com.amychong.tourmanagementapp.service.review;

import com.amychong.tourmanagementapp.dto.ReviewDTO;
import com.amychong.tourmanagementapp.entity.booking.Booking;
import com.amychong.tourmanagementapp.entity.review.Review;
import com.amychong.tourmanagementapp.entity.tour.Tour;
import com.amychong.tourmanagementapp.entity.user.Role;
import com.amychong.tourmanagementapp.exception.NotFoundException;
import com.amychong.tourmanagementapp.exception.PermissionDeniedException;
import com.amychong.tourmanagementapp.mapper.ReviewMapper;
import com.amychong.tourmanagementapp.repository.booking.BookingRepository;
import com.amychong.tourmanagementapp.repository.review.ReviewRepository;
import com.amychong.tourmanagementapp.service.auth.AuthenticationService;
import com.amychong.tourmanagementapp.service.helper.UserHelper;
import com.amychong.tourmanagementapp.service.tour.TourService;
import com.amychong.tourmanagementapp.service.helper.ValidationHelper;
import com.amychong.tourmanagementapp.service.generic.GenericServiceImpl;
import com.amychong.tourmanagementapp.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewServiceImpl extends GenericServiceImpl<Review, ReviewDTO> implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;
    private final BookingRepository bookingRepository;
    private final TourService tourService;
    private final AuthenticationService authService;

    @Autowired
    public ReviewServiceImpl(ReviewRepository theReviewRepository, ReviewMapper theReviewMapper, BookingRepository theBookingRepository, TourService theTourService, AuthenticationService theAuthService) {
        super(theReviewRepository, Review.class, ReviewDTO.class, theReviewMapper);
        reviewRepository = theReviewRepository;
        reviewMapper = theReviewMapper;
        bookingRepository = theBookingRepository;
        tourService = theTourService;
        authService = theAuthService;
    }

    @Override
    public List<ReviewDTO> findByUserId(Integer theUserId) {
        ValidationHelper.validateId(theUserId);

        List<Review> theReviews = reviewRepository.findByBooking_User_Id(theUserId);
        return reviewMapper.toDTOList(theReviews);
    }

    @Override
    public List<ReviewDTO> findByTourId(Integer theTourId) {
        ValidationHelper.validateId(theTourId);

        List<Review> theReviews = reviewRepository.findByBooking_TourStartDate_Tour_Id(theTourId);
        return reviewMapper.toDTOList(theReviews);
    }

    @Override
    @Transactional
    public ReviewDTO create(Review inputReview) {
        ValidationHelper.validateNotNull(inputReview, "Review must not be null.");
        ValidationHelper.validateNotNull(inputReview.getBooking(), "Booking must not be null.");
        Booking dbBooking = validateBookingAndFindFromDB(inputReview.getBooking().getId());
        validateUser(dbBooking.getUser().getId());

        Review copyOfInputReview = inputReview.deepCopy();
        copyOfInputReview.setId(0);
        copyOfInputReview.setCreatedDate(LocalDate.now());
        Review dbReview = reviewRepository.save(copyOfInputReview);

        Tour associatedTour = dbReview.getBooking().getTourStartDate().getTour();
        tourService.updateTourRatingsAfterAddingReview(associatedTour.deepCopy(), dbReview.getRating());

        return reviewMapper.toDTO(dbReview);
    }

    @Override
    @Transactional
    public void deleteById(Integer inputReviewId) {
        ValidationHelper.validateId(inputReviewId);
        Review reviewToBeDeleted = reviewRepository.findById(inputReviewId)
                .orElseThrow(() -> new NotFoundException("Did not find review id - " + inputReviewId));
        validateUser(reviewToBeDeleted.getBooking().getUser().getId());

        Tour associatedTour = reviewToBeDeleted.getBooking().getTourStartDate().getTour();
        tourService.updateTourRatingsAfterDeletingReview(associatedTour.deepCopy(), reviewToBeDeleted.getRating());

        reviewRepository.deleteById(inputReviewId);
    }

    private Booking validateBookingAndFindFromDB(Integer bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new NotFoundException("Booking not found. Review cannot be created without an associated booking."));
    }

    private void validateUser(Integer userId) {
        if (authService.verifyAuthenticatedUserHasRole(Role.ROLE_CUSTOMER) && !authService.verifyAuthenticatedUserHasId(userId)) {
            throw new PermissionDeniedException("Customer can only create or delete reviews for their own bookings.");
        }
    }
}
