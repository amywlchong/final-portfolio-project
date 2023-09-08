package com.amychong.tourmanagementapp.mapper;

import com.amychong.tourmanagementapp.dto.TourGuideScheduleDTO;
import com.amychong.tourmanagementapp.entity.TourGuideSchedule;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel="spring", uses = UserMapper.class)
public interface TourGuideScheduleMapper extends GenericMapper<TourGuideSchedule, TourGuideScheduleDTO> {

    TourGuideScheduleMapper INSTANCE = Mappers.getMapper(TourGuideScheduleMapper.class);

    @Override
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.name", target = "userName")
    @Mapping(source = "user.active", target = "userActive")
    @Mapping(source = "user.userRole", target = "userRole")
    @Mapping(source = "tourStartDate.tour.id", target = "tourId")
    @Mapping(source = "tourStartDate.tour.name", target = "tourName")
    @Mapping(source = "tourStartDate.tour.duration", target = "tourDuration")
    @Mapping(source = "tourStartDate.tour.region", target = "tourRegion")
    @Mapping(source = "tourStartDate.startDate.id", target = "startDateId")
    @Mapping(source = "tourStartDate.startDate.startDateTime", target = "startDateTime")
    TourGuideScheduleDTO toDTO(TourGuideSchedule tourGuideSchedule);

}

