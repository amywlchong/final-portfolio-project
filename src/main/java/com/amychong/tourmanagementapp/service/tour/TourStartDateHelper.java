package com.amychong.tourmanagementapp.service.tour;

import com.amychong.tourmanagementapp.entity.tour.TourStartDate;

public class TourStartDateHelper {

    public static Integer computeAvailableSpacesForStartDates(TourStartDate tourStartDate, Integer totalBookedSpaces) {
        Integer maxGroupSize = tourStartDate.getTour().getMaxGroupSize();

        if (totalBookedSpaces == null) {
            totalBookedSpaces = 0;
        }

        return maxGroupSize - totalBookedSpaces;
    }

}
