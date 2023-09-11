package com.amychong.tourmanagementapp.service;

import com.amychong.tourmanagementapp.entity.*;
import com.amychong.tourmanagementapp.exception.NotFoundException;
import com.amychong.tourmanagementapp.repository.BookingRepository;
import com.amychong.tourmanagementapp.repository.TourStartDateRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public class TourStartDateHelper {

    protected static Integer extractTourId(HasTourStartDate entity) {
        return Optional.ofNullable(entity.getTourStartDate())
                .map(TourStartDate::getTour)
                .map(Tour::getId)
                .orElseThrow(() -> new IllegalArgumentException("Tour and tour id must not be null."));
    }

    protected static LocalDateTime extractStartDateTime(HasTourStartDate entity) {
        return Optional.ofNullable(entity.getTourStartDate())
                .map(TourStartDate::getStartDate)
                .map(StartDate::getStartDateTime)
                .orElseThrow(() -> new IllegalArgumentException("Start date and start date time must not be null."));
    }

    protected static TourStartDate validateTourStartDateAndFindFromDB(Integer tourId, LocalDateTime startDateTime, TourStartDateRepository tourStartDateRepository) {
        TourStartDate dbTourStartDate = tourStartDateRepository.findByTour_IdAndStartDate_StartDateTime(tourId, startDateTime);
        if (dbTourStartDate == null) {
            throw new NotFoundException("You're referencing a tour-start date pair that does not exist - tourId: " + tourId + ", startDateTime: " + startDateTime);
        }
        return dbTourStartDate;
    }

    protected static Integer computeAvailableSpaces(TourStartDate tourStartDate, BookingRepository bookingRepository) {
        Integer maxGroupSize = tourStartDate.getTour().getMaxGroupSize();
        Integer totalBookedSpaces = bookingRepository.sumParticipantsByTourStartDate(tourStartDate);
        if (totalBookedSpaces == null) {
            totalBookedSpaces = 0;
        }
        return maxGroupSize - totalBookedSpaces;
    }
}
