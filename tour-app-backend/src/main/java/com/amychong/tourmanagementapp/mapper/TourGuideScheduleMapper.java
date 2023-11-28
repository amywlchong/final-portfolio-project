package com.amychong.tourmanagementapp.mapper;

import com.amychong.tourmanagementapp.dto.schedule.ScheduleRequestDTO;
import com.amychong.tourmanagementapp.dto.schedule.ScheduleResponseDTO;
import com.amychong.tourmanagementapp.entity.schedule.TourGuideSchedule;
import com.amychong.tourmanagementapp.service.EntityLookup;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import static com.amychong.tourmanagementapp.mapper.TourStartDateMapper.mapToTourStartDate;
import static com.amychong.tourmanagementapp.mapper.UserMapper.mapToUser;

@Mapper(componentModel = "spring", uses = UserMapper.class)
public interface TourGuideScheduleMapper
    extends GenericMapper<TourGuideSchedule, ScheduleResponseDTO> {

  TourGuideScheduleMapper INSTANCE = Mappers.getMapper(TourGuideScheduleMapper.class);

  @Override
  @Mapping(source = "user.id", target = "userId")
  @Mapping(source = "user.name", target = "userName")
  @Mapping(source = "user.active", target = "userActive")
  @Mapping(source = "user.role", target = "userRole")
  @Mapping(source = "tourStartDate.tour.id", target = "tourId")
  @Mapping(source = "tourStartDate.tour.name", target = "tourName")
  @Mapping(source = "tourStartDate.tour.duration", target = "tourDuration")
  @Mapping(source = "tourStartDate.tour.region", target = "tourRegion")
  @Mapping(source = "tourStartDate.startDate.id", target = "startDateId")
  @Mapping(source = "tourStartDate.startDate.startDateTime", target = "startDateTime")
  ScheduleResponseDTO toDTO(TourGuideSchedule tourGuideSchedule);

  default TourGuideSchedule toTourGuideSchedule(
      ScheduleRequestDTO requestBody, EntityLookup entityLookup) {
    TourGuideSchedule tourGuideSchedule = new TourGuideSchedule();
    tourGuideSchedule.setUser(mapToUser(requestBody.getUserId(), entityLookup));
    tourGuideSchedule.setTourStartDate(
        mapToTourStartDate(requestBody.getTourId(), requestBody.getStartDateTime(), entityLookup));
    return tourGuideSchedule;
  }
}
