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
    @Mapping(source = "tour.id", target = "tourId")
    @Mapping(source = "tour.name", target = "tourName")
    @Mapping(source = "tour.duration", target = "tourDuration")
    @Mapping(source = "tour.region", target = "tourRegion")
    @Mapping(source = "startDate.id", target = "startDateId")
    @Mapping(source = "startDate.startDateTime", target = "startDateTime")
    TourGuideScheduleDTO toDTO(TourGuideSchedule tourGuideSchedule);

}

