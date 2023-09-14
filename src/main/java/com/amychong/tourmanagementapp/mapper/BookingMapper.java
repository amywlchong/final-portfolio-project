package com.amychong.tourmanagementapp.mapper;

import com.amychong.tourmanagementapp.dto.BookingDTO;
import com.amychong.tourmanagementapp.entity.booking.Booking;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel="spring", uses = UserMapper.class)
public interface BookingMapper extends GenericMapper<Booking, BookingDTO> {

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
    BookingDTO toDTO(Booking booking);
}
