package com.amychong.tourmanagementapp.service;

import com.amychong.tourmanagementapp.entity.booking.Booking;
import com.amychong.tourmanagementapp.entity.tour.Tour;
import com.amychong.tourmanagementapp.entity.tour.TourImage;
import com.amychong.tourmanagementapp.entity.tour.TourStartDate;
import com.amychong.tourmanagementapp.entity.user.User;
import com.amychong.tourmanagementapp.exception.NotFoundException;
import com.amychong.tourmanagementapp.repository.booking.BookingRepository;
import com.amychong.tourmanagementapp.repository.tour.TourImageRepository;
import com.amychong.tourmanagementapp.repository.tour.TourRepository;
import com.amychong.tourmanagementapp.repository.tour.TourStartDateRepository;
import com.amychong.tourmanagementapp.repository.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Optional;

@Component
public class EntityLookup {

  private final UserRepository userRepository;
  private final TourRepository tourRepository;
  private final TourImageRepository tourImageRepository;
  private final TourStartDateRepository tourStartDateRepository;
  private final BookingRepository bookingRepository;

  @Autowired
  public EntityLookup(
      UserRepository userRepository,
      TourRepository tourRepository,
      TourImageRepository tourImageRepository,
      TourStartDateRepository tourStartDateRepository,
      BookingRepository bookingRepository) {
    this.userRepository = userRepository;
    this.tourRepository = tourRepository;
    this.tourImageRepository = tourImageRepository;
    this.tourStartDateRepository = tourStartDateRepository;
    this.bookingRepository = bookingRepository;
  }

  public User findUserByIdOrThrow(Integer userId) {
    return userRepository
        .findById(userId)
        .orElseThrow(() -> new NotFoundException("Did not find user id - " + userId));
  }

  public Tour findTourByIdOrThrow(Integer tourId) {
    return tourRepository
        .findById(tourId)
        .orElseThrow(() -> new NotFoundException("Did not find tour id - " + tourId));
  }

  public Tour findTourByIdWithDetailsOrThrow(Integer tourId) {
    Optional<Tour> tourWithImages = tourRepository.findByIdWithTourImages(tourId);
    tourRepository.findByIdWithTourPointsOfInterest(tourId); // This populates the cache
    tourRepository.findByIdWithTourStartDates(tourId); // This too populates the cache

    return tourWithImages.orElseThrow(
        () -> new NotFoundException("Did not find tour id - " + tourId));
  }

  public TourImage findTourImageByIdOrThrow(Integer imageId) {
    return tourImageRepository
        .findById(imageId)
        .orElseThrow(() -> new NotFoundException("Did not find tour image id - " + imageId));
  }

  public TourStartDate findTourStartDateByTourIdAndStartDateTimeOrThrow(
      Integer tourId, LocalDateTime startDateTime) {
    return tourStartDateRepository
        .findByTour_IdAndStartDate_StartDateTime(tourId, startDateTime)
        .orElseThrow(
            () ->
                new NotFoundException(
                    "Did not find tour start date with tour id: "
                        + tourId
                        + " and start date time: "
                        + startDateTime));
  }

  public Booking findBookingByIdOrThrow(Integer bookingId) {
    return bookingRepository
        .findById(bookingId)
        .orElseThrow(() -> new NotFoundException("Did not find booking id - " + bookingId));
  }
}
