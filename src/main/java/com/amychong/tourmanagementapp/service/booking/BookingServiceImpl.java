package com.amychong.tourmanagementapp.service.booking;

import com.amychong.tourmanagementapp.dto.BookingDTO;
import com.amychong.tourmanagementapp.entity.booking.Booking;
import com.amychong.tourmanagementapp.entity.tour.Tour;
import com.amychong.tourmanagementapp.entity.tour.TourStartDate;
import com.amychong.tourmanagementapp.entity.user.Role;
import com.amychong.tourmanagementapp.exception.NotFoundException;
import com.amychong.tourmanagementapp.exception.PermissionDeniedException;
import com.amychong.tourmanagementapp.mapper.BookingMapper;
import com.amychong.tourmanagementapp.repository.booking.BookingRepository;
import com.amychong.tourmanagementapp.service.auth.AuthenticationService;
import com.amychong.tourmanagementapp.service.generic.GenericServiceImpl;
import com.amychong.tourmanagementapp.service.helper.UserHelper;
import com.amychong.tourmanagementapp.service.helper.ValidationHelper;
import com.amychong.tourmanagementapp.service.tour.TourService;
import com.amychong.tourmanagementapp.service.helper.TourStartDateHelper;
import com.amychong.tourmanagementapp.service.tour.TourStartDateService;
import com.amychong.tourmanagementapp.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
public class BookingServiceImpl extends GenericServiceImpl<Booking, BookingDTO> implements BookingService {

    private final BookingRepository bookingRepository;
    private final BookingMapper bookingMapper;
    private final UserService userService;
    private final TourStartDateService tourStartDateService;
    private final TourService tourService;
    private final AuthenticationService authService;

    @Autowired
    public BookingServiceImpl(BookingRepository theBookingRepository, BookingMapper theBookingMapper, UserService theUserService, TourStartDateService theTourStartDateService, TourService theTourService, AuthenticationService theAuthService) {
        super(theBookingRepository, Booking.class, BookingDTO.class, theBookingMapper);
        bookingRepository = theBookingRepository;
        bookingMapper = theBookingMapper;
        userService = theUserService;
        tourStartDateService = theTourStartDateService;
        tourService = theTourService;
        authService = theAuthService;
    }

    @Override
    public Booking validateBookingIdAndFindBooking(Integer bookingId) {
        ValidationHelper.validateId(bookingId);
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new NotFoundException("Did not find booking id - " + bookingId));
    }

    @Override
    public List<BookingDTO> findByUserId(Integer theUserId) {
        ValidationHelper.validateId(theUserId);

        List<Booking> theBookings = bookingRepository.findByUser_Id(theUserId);
        return bookingMapper.toDTOList(theBookings);
    }

    @Override
    public List<BookingDTO> findByTourId(Integer theTourId) {
        ValidationHelper.validateId(theTourId);

        List<Booking> theBookings = bookingRepository.findByTourStartDate_Tour_Id(theTourId);
        return bookingMapper.toDTOList(theBookings);
    }

    @Override
    @Transactional
    public BookingDTO create(Booking inputBooking) {
        ValidationHelper.validateNotNull(inputBooking, "Booking must not be null.");
        validateUser(inputBooking);
        TourStartDate dbTourStartDate = validateTourStartDateAndFindFromDB(inputBooking);
        validateAvailableSpacesConstraint(dbTourStartDate, inputBooking.getNumberOfParticipants());

        Booking processedBooking = processBookingForCreate(inputBooking, dbTourStartDate);

        return super.create(processedBooking);
    }

    // Allow only the 'startDate' field to be updated.
    // Throw an exception if client tries to update other fields
    @Override
    @Transactional
    public BookingDTO update(Integer inputBookingId, Booking inputBooking) {
        ValidationHelper.validateNotNull(inputBooking, "Booking must not be null.");
        validateUser(inputBooking);
        TourStartDate dbTourStartDate = validateTourStartDateAndFindFromDB(inputBooking);
        validateAvailableSpacesConstraint(dbTourStartDate, inputBooking.getNumberOfParticipants());

        Booking existingBooking = validateBookingIdAndFindBooking(inputBookingId);
        validateUnchangedFields(existingBooking, inputBooking);

        Booking copyOfExistingBooking = existingBooking.deepCopy();
        copyOfExistingBooking.setTourStartDate(dbTourStartDate);

        return super.save(copyOfExistingBooking);
    }

    @Override
    @Transactional
    public void updateOrDeleteBookingAfterPaymentProcessing(Booking dbBooking, String transactionId, String status) {
        if ("COMPLETED".equals(status)) {
            Booking copyOfDbBooking = dbBooking.deepCopy();
            copyOfDbBooking.setTransactionId(transactionId);
            copyOfDbBooking.setPaid(true);
            bookingRepository.save(copyOfDbBooking);
        } else {
            bookingRepository.delete(dbBooking);
        }
    }

    private void validateUser(Booking inputBooking) {
        Integer inputUserId = UserHelper.extractUserId(inputBooking);

        if (authService.verifyAuthenticatedUserHasRole(Role.ROLE_CUSTOMER) && !authService.verifyAuthenticatedUserHasId(inputUserId)) {
            throw new PermissionDeniedException("Customer can only create or update bookings for themselves.");
        }
        if (!userService.verifyInputUserHasRole(inputUserId, "ROLE_CUSTOMER")) {
            throw new RuntimeException("User associated with booking must be a customer");
        }
    }

    private TourStartDate validateTourStartDateAndFindFromDB(Booking inputBooking) {
        Integer inputTourId = TourStartDateHelper.extractTourId(inputBooking);
        LocalDateTime inputStartDateTime = TourStartDateHelper.extractStartDateTime(inputBooking);
        TourStartDate dbTourStartDate = tourStartDateService.validateTourStartDateAndFindFromDB(inputTourId, inputStartDateTime);
        return dbTourStartDate;
    }

    private void validateAvailableSpacesConstraint(TourStartDate tourStartDate, int inputNumberOfParticipants) {
        Integer totalBookedSpaces = bookingRepository.sumParticipantsByTourStartDate(tourStartDate);
        Integer availableSpaces = TourStartDateHelper.computeAvailableSpacesForStartDates(tourStartDate, totalBookedSpaces);

        if (inputNumberOfParticipants > availableSpaces) {
            throw new IllegalStateException("Not enough available spaces for the given number of participants");
        }
    }

    private void validateUnchangedFields(Booking existingBooking, Booking inputBooking) {
        validateFieldsAreSame("paid", existingBooking.isPaid(), inputBooking.isPaid());
        validateFieldsAreSame("transactionId", existingBooking.getTransactionId(), inputBooking.getTransactionId());
        validateFieldsAreSame("numberOfParticipants", existingBooking.getNumberOfParticipants(), inputBooking.getNumberOfParticipants());
        validateFieldsAreSame("unitPrice", existingBooking.getUnitPrice(), inputBooking.getUnitPrice());
        validateFieldsAreSame("totalPrice", existingBooking.getTotalPrice(), inputBooking.getTotalPrice());
        validateFieldsAreSame("user", existingBooking.getUser(), inputBooking.getUser());
        validateFieldsAreSame("tour", existingBooking.getTourStartDate().getTour(), inputBooking.getTourStartDate().getTour());
    }

    private <T> void validateFieldsAreSame(String fieldName, T existingValue, T inputValue) {
        if (!Objects.equals(existingValue, inputValue)) {
            throw new IllegalArgumentException(
                    "The provided value for " + fieldName + " does not match the existing value. " +
                            "You're trying to update " + fieldName + ", but only the 'startDate' field can be updated.");
        }
    }

    private Booking processBookingForCreate(Booking theBooking, TourStartDate dbTourStartDate) {
        Booking copyOfBooking = theBooking.deepCopy();

        setBookingPricing(TourStartDateHelper.extractTourId(theBooking), copyOfBooking, theBooking.getNumberOfParticipants());
        copyOfBooking.setPaid(false);
        copyOfBooking.setTransactionId(null);
        copyOfBooking.setTourStartDate(dbTourStartDate);
        copyOfBooking.setCreatedDate(LocalDate.now());

        return copyOfBooking;
    }

    private void setBookingPricing(Integer theTourId, Booking theBooking, int numberOfParticipants) {
        Tour existingTour = tourService.findById(theTourId);

        BigDecimal tourUnitPrice = existingTour.getPrice();
        BigDecimal totalPrice = tourUnitPrice.multiply(BigDecimal.valueOf(numberOfParticipants));

        theBooking.setUnitPrice(tourUnitPrice);
        theBooking.setTotalPrice(totalPrice);
    }
}
