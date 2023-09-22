package com.amychong.tourmanagementapp.service;

import com.amychong.tourmanagementapp.entity.booking.Booking;
import com.amychong.tourmanagementapp.entity.tour.TourStartDate;
import com.amychong.tourmanagementapp.entity.user.User;
import com.amychong.tourmanagementapp.exception.NotFoundException;
import com.amychong.tourmanagementapp.repository.booking.BookingRepository;
import com.amychong.tourmanagementapp.repository.tour.TourStartDateRepository;
import com.amychong.tourmanagementapp.repository.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class EntityLookup {

    private final UserRepository userRepository;
    private final TourStartDateRepository tourStartDateRepository;
    private final BookingRepository bookingRepository;

    @Autowired
    public EntityLookup(UserRepository userRepository, TourStartDateRepository tourStartDateRepository, BookingRepository bookingRepository) {
        this.userRepository = userRepository;
        this.tourStartDateRepository = tourStartDateRepository;
        this.bookingRepository = bookingRepository;
    }

    public User findUserByIdOrThrow(Integer userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Did not find user id - " + userId));
    }

    public TourStartDate findTourStartDateByTourIdAndStartDateTimeOrThrow(Integer tourId, LocalDateTime startDateTime) {
        return tourStartDateRepository.findByTour_IdAndStartDate_StartDateTime(tourId, startDateTime)
                .orElseThrow(() -> new NotFoundException("Did not find tour start date with tour id: " + tourId +
                        " and start date time: " + startDateTime));
    }

    public Booking findBookingByIdOrThrow(Integer bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new NotFoundException("Did not find booking id - " + bookingId));
    }
}
