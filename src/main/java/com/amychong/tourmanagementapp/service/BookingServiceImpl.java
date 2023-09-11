package com.amychong.tourmanagementapp.service;

import com.amychong.tourmanagementapp.dto.BookingDTO;
import com.amychong.tourmanagementapp.entity.*;
import com.amychong.tourmanagementapp.mapper.BookingMapper;
import com.amychong.tourmanagementapp.repository.BookingRepository;
import com.amychong.tourmanagementapp.repository.TourRepository;
import com.amychong.tourmanagementapp.repository.TourStartDateRepository;
import com.amychong.tourmanagementapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class BookingServiceImpl extends GenericServiceImpl<Booking, BookingDTO> implements BookingService {

    private BookingRepository bookingRepository;
    private BookingMapper bookingMapper;
    private UserRepository userRepository;
    private TourStartDateRepository tourStartDateRepository;
    private TourRepository tourRepository;

    @Autowired
    public BookingServiceImpl(BookingRepository theBookingRepository, BookingMapper theBookingMapper, UserRepository theUserRepository, TourStartDateRepository theTourStartDateRepository, TourRepository theTourRepository) {
        super(theBookingRepository, theBookingMapper, Booking.class, BookingDTO.class);
        bookingRepository = theBookingRepository;
        bookingMapper = theBookingMapper;
        userRepository = theUserRepository;
        tourStartDateRepository = theTourStartDateRepository;
        tourRepository = theTourRepository;
    }

    @Override
    public List<BookingDTO> findByUserId(Integer theUserId) {
        super.validateId(theUserId);

        List<Booking> theBookings = bookingRepository.findByUser_Id(theUserId);
        return bookingMapper.toDTOList(theBookings);
    }

    @Override
    public List<BookingDTO> findByTourId(Integer theTourId) {
        super.validateId(theTourId);

        List<Booking> theBookings = bookingRepository.findByTourStartDate_Tour_Id(theTourId);
        return bookingMapper.toDTOList(theBookings);
    }

    // Allow only the 'startDate' field to be updated.
    // Throw an exception if client tries to update other fields
    @Override
    @Transactional
    public BookingDTO update(Integer inputBookingId, Booking inputBooking) {
        super.validateNotNull(inputBooking, "Booking must not be null.");
        validateUserRole(inputBooking);
        TourStartDate dbTourStartDate = validateTourStartDateAndFindFromDB(inputBooking);
        validateAvailableSpacesConstraint(dbTourStartDate, inputBooking.getNumberOfParticipants());

        Booking existingBooking = bookingMapper.fromDTO(findById(inputBookingId));
        validateUnchangedFields(existingBooking, inputBooking);

        Booking copyOfExistingBooking = existingBooking.deepCopy();
        copyOfExistingBooking.setTourStartDate(dbTourStartDate);

        return super.save(copyOfExistingBooking);
    }

    @Override
    @Transactional
    public BookingDTO create(Booking inputBooking) {
        super.validateNotNull(inputBooking, "Booking must not be null.");
        validateUserRole(inputBooking);
        TourStartDate dbTourStartDate = validateTourStartDateAndFindFromDB(inputBooking);
        validateAvailableSpacesConstraint(dbTourStartDate, inputBooking.getNumberOfParticipants());

        Booking processedBooking = processBookingForCreate(inputBooking, dbTourStartDate);

        return super.create(processedBooking);
    }

    private void validateUserRole(Booking inputBooking) {
        Integer inputUserId = UserHelper.extractUserId(inputBooking);
        UserHelper.validateUserRole(inputUserId, userRepository, "User must be a customer", "ROLE_CUSTOMER");
    }

    private TourStartDate validateTourStartDateAndFindFromDB(Booking inputBooking) {
        Integer inputTourId = TourStartDateHelper.extractTourId(inputBooking);
        LocalDateTime inputStartDateTime = TourStartDateHelper.extractStartDateTime(inputBooking);
        TourStartDate dbTourStartDate = TourStartDateHelper.validateTourStartDateAndFindFromDB(inputTourId, inputStartDateTime, tourStartDateRepository);
        return dbTourStartDate;
    }

    private void validateUnchangedFields(Booking existingBooking, Booking inputBooking) {
        validateFieldsAreSame("paid", existingBooking.isPaid(), inputBooking.isPaid());
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
        copyOfBooking.setTourStartDate(dbTourStartDate);
        copyOfBooking.setCreatedDate(LocalDate.now());

        return copyOfBooking;
    }


    private void validateAvailableSpacesConstraint(TourStartDate tourStartDate, int inputNumberOfParticipants) {
        Integer availableSpaces = TourStartDateHelper.computeAvailableSpaces(tourStartDate, bookingRepository);

        if (inputNumberOfParticipants > availableSpaces) {
            throw new IllegalStateException("Not enough available spaces for the given number of participants");
        }
    }

    private void setBookingPricing(Integer validatedTourId, Booking validatedBooking, int validatedNumberOfParticipants) {
        Optional<Tour> existingTour = tourRepository.findById(validatedTourId);

        BigDecimal tourUnitPrice = existingTour.get().getPrice();
        BigDecimal totalPrice = tourUnitPrice.multiply(BigDecimal.valueOf(validatedNumberOfParticipants));

        validatedBooking.setUnitPrice(tourUnitPrice);
        validatedBooking.setTotalPrice(totalPrice);
    }
}
