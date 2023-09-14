package com.amychong.tourmanagementapp.service.helper;

import com.amychong.tourmanagementapp.entity.interfaces.HasTourStartDate;
import com.amychong.tourmanagementapp.entity.tour.StartDate;
import com.amychong.tourmanagementapp.entity.tour.Tour;
import com.amychong.tourmanagementapp.entity.tour.TourStartDate;

import java.time.LocalDateTime;
import java.util.Optional;

public class TourStartDateHelper {

    public static Integer extractTourId(HasTourStartDate entity) {
        return Optional.ofNullable(entity.getTourStartDate())
                .map(TourStartDate::getTour)
                .map(Tour::getId)
                .orElseThrow(() -> new IllegalArgumentException("Tour and tour id must not be null."));
    }

    public static LocalDateTime extractStartDateTime(HasTourStartDate entity) {
        return Optional.ofNullable(entity.getTourStartDate())
                .map(TourStartDate::getStartDate)
                .map(StartDate::getStartDateTime)
                .orElseThrow(() -> new IllegalArgumentException("Start date and start date time must not be null."));
    }

    public static Integer computeAvailableSpacesForStartDates(TourStartDate tourStartDate, Integer totalBookedSpaces) {
        Integer maxGroupSize = tourStartDate.getTour().getMaxGroupSize();

        if (totalBookedSpaces == null) {
            totalBookedSpaces = 0;
        }

        return maxGroupSize - totalBookedSpaces;
    }

}
