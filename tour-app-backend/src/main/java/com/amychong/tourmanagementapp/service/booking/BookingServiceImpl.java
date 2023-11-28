package com.amychong.tourmanagementapp.service.booking;

import com.amychong.tourmanagementapp.dto.booking.BookingResponseDTO;
import com.amychong.tourmanagementapp.dto.booking.BookingRequestDTO;
import com.amychong.tourmanagementapp.entity.booking.Booking;
import com.amychong.tourmanagementapp.entity.tour.Tour;
import com.amychong.tourmanagementapp.entity.tour.TourStartDate;
import com.amychong.tourmanagementapp.entity.user.Role;
import com.amychong.tourmanagementapp.exception.PermissionDeniedException;
import com.amychong.tourmanagementapp.mapper.BookingMapper;
import com.amychong.tourmanagementapp.repository.booking.BookingRepository;
import com.amychong.tourmanagementapp.service.auth.AuthenticationService;
import com.amychong.tourmanagementapp.service.generic.GenericServiceImpl;
import com.amychong.tourmanagementapp.service.tour.TourService;
import com.amychong.tourmanagementapp.service.tour.TourStartDateHelper;
import com.amychong.tourmanagementapp.service.user.UserService;
import com.amychong.tourmanagementapp.service.EntityLookup;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
public class BookingServiceImpl extends GenericServiceImpl<Booking, BookingResponseDTO>
    implements BookingService {

  private final BookingRepository bookingRepository;
  private final BookingMapper bookingMapper;
  private final EntityLookup entityLookup;
  private final UserService userService;
  private final TourService tourService;
  private final AuthenticationService authService;

  @Autowired
  public BookingServiceImpl(
      BookingRepository theBookingRepository,
      BookingMapper theBookingMapper,
      EntityLookup theEntityLookup,
      UserService theUserService,
      TourService theTourService,
      AuthenticationService theAuthService) {
    super(theBookingRepository, Booking.class, BookingResponseDTO.class, theBookingMapper);
    bookingRepository = theBookingRepository;
    bookingMapper = theBookingMapper;
    entityLookup = theEntityLookup;
    userService = theUserService;
    tourService = theTourService;
    authService = theAuthService;
  }

  @Override
  public List<BookingResponseDTO> findByUserId(Integer theUserId) {
    List<Booking> theBookings = bookingRepository.findByUser_Id(theUserId);
    return bookingMapper.toDTOList(theBookings);
  }

  @Override
  public List<BookingResponseDTO> findByTourId(Integer theTourId) {
    List<Booking> theBookings = bookingRepository.findByTourStartDate_Tour_Id(theTourId);
    return bookingMapper.toDTOList(theBookings);
  }

  @Override
  @Transactional
  public BookingResponseDTO create(BookingRequestDTO inputBooking) {
    validateUser(inputBooking);
    TourStartDate dbTourStartDate = validateTourStartDateAndFindFromDB(inputBooking);
    validateAvailableSpacesConstraint(dbTourStartDate, inputBooking.getNumberOfParticipants());

    Booking processedBooking = processBookingForCreate(inputBooking);

    return super.create(processedBooking);
  }

  // Allow only the 'startDate' field to be updated.
  // Throw an exception if client tries to update other fields (# of participants, user id, or tour
  // id)
  @Override
  @Transactional
  public BookingResponseDTO update(Integer inputBookingId, BookingRequestDTO inputBooking) {
    validateUser(inputBooking);
    TourStartDate dbTourStartDate = validateTourStartDateAndFindFromDB(inputBooking);

    Booking existingBooking = entityLookup.findBookingByIdOrThrow(inputBookingId);
    if (existingBooking
        .getTourStartDate()
        .getStartDate()
        .getStartDateTime()
        .isBefore(LocalDateTime.now())) {
      throw new IllegalArgumentException("Past bookings cannot be updated.");
    }
    if (!existingBooking
        .getTourStartDate()
        .getStartDate()
        .getStartDateTime()
        .equals(inputBooking.getStartDateTime())) {
      validateAvailableSpacesConstraint(dbTourStartDate, inputBooking.getNumberOfParticipants());
    }
    validateUnchangedFields(existingBooking, inputBooking);

    Booking copyOfExistingBooking = existingBooking.deepCopy();
    copyOfExistingBooking.setTourStartDate(dbTourStartDate);

    return super.save(copyOfExistingBooking);
  }

  @Override
  @Transactional
  public void updateOrDeleteBookingAfterPaymentProcessing(
      Booking dbBooking, String transactionId, String status) {
    if ("COMPLETED".equals(status)) {
      Booking copyOfDbBooking = dbBooking.deepCopy();
      copyOfDbBooking.setTransactionId(transactionId);
      copyOfDbBooking.setPaid(true);
      bookingRepository.save(copyOfDbBooking);
    } else {
      bookingRepository.delete(dbBooking);
    }
  }

  private void validateUser(BookingRequestDTO inputBooking) {
    Integer inputUserId = inputBooking.getUserId();

    if (authService.verifyAuthenticatedUserHasRole(Role.ROLE_CUSTOMER)
        && !authService.verifyAuthenticatedUserHasId(inputUserId)) {
      throw new PermissionDeniedException(
          "Customer can only create or update bookings for themselves.");
    }
    if (!userService.verifyInputUserIsActive(inputUserId)) {
      throw new IllegalArgumentException(
          "User associated with new or to-be-updated booking must be active");
    }
    if (!userService.verifyInputUserHasRole(inputUserId, "ROLE_CUSTOMER")) {
      throw new IllegalArgumentException("User associated with booking must be a customer");
    }
  }

  private TourStartDate validateTourStartDateAndFindFromDB(BookingRequestDTO inputBooking) {
    Integer inputTourId = inputBooking.getTourId();
    LocalDateTime inputStartDateTime = inputBooking.getStartDateTime();
    TourStartDate dbTourStartDate =
        entityLookup.findTourStartDateByTourIdAndStartDateTimeOrThrow(
            inputTourId, inputStartDateTime);
    return dbTourStartDate;
  }

  private void validateAvailableSpacesConstraint(
      TourStartDate tourStartDate, int inputNumberOfParticipants) {
    Integer totalBookedSpaces = bookingRepository.sumParticipantsByTourStartDate(tourStartDate);
    Integer availableSpaces =
        TourStartDateHelper.computeAvailableSpacesForStartDates(tourStartDate, totalBookedSpaces);

    if (inputNumberOfParticipants > availableSpaces) {
      throw new IllegalStateException(
          "Not enough available spaces for the given number of participants");
    }
  }

  private void validateUnchangedFields(Booking existingBooking, BookingRequestDTO inputBooking) {
    validateFieldsAreSame(
        "numberOfParticipants",
        existingBooking.getNumberOfParticipants(),
        inputBooking.getNumberOfParticipants());
    validateFieldsAreSame("userId", existingBooking.getUser().getId(), inputBooking.getUserId());
    validateFieldsAreSame(
        "tourId", existingBooking.getTourStartDate().getTour().getId(), inputBooking.getTourId());
  }

  private <T> void validateFieldsAreSame(String fieldName, T existingValue, T inputValue) {
    if (!Objects.equals(existingValue, inputValue)) {
      throw new IllegalArgumentException(
          "The provided value for "
              + fieldName
              + " does not match the existing value. "
              + "You're trying to update "
              + fieldName
              + ", but only the 'startDate' field can be updated.");
    }
  }

  private Booking processBookingForCreate(BookingRequestDTO inputBooking) {
    Booking bookingToBeAdded = bookingMapper.toBooking(inputBooking, entityLookup);

    setBookingPricing(
        bookingToBeAdded, inputBooking.getTourId(), inputBooking.getNumberOfParticipants());
    bookingToBeAdded.setPaid(false);
    bookingToBeAdded.setTransactionId(null);
    bookingToBeAdded.setCreatedDate(LocalDate.now());

    return bookingToBeAdded;
  }

  private void setBookingPricing(Booking theBooking, Integer theTourId, int numberOfParticipants) {
    Tour existingTour = entityLookup.findTourByIdOrThrow(theTourId);

    BigDecimal tourUnitPrice = existingTour.getPrice();
    BigDecimal totalPrice = tourUnitPrice.multiply(BigDecimal.valueOf(numberOfParticipants));

    theBooking.setUnitPrice(tourUnitPrice);
    theBooking.setTotalPrice(totalPrice);
  }
}
