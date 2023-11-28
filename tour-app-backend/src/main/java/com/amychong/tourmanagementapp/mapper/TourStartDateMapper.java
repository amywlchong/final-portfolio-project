package com.amychong.tourmanagementapp.mapper;

import com.amychong.tourmanagementapp.entity.tour.TourStartDate;
import com.amychong.tourmanagementapp.service.EntityLookup;
import org.mapstruct.Mapper;

import java.time.LocalDateTime;

@Mapper(componentModel="spring")
public interface TourStartDateMapper {

    static TourStartDate mapToTourStartDate(Integer tourId, LocalDateTime startDateTime, EntityLookup entityLookup) {
        return entityLookup.findTourStartDateByTourIdAndStartDateTimeOrThrow(tourId, startDateTime);
    }
}
