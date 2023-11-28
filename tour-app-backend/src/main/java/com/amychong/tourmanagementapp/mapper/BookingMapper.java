package com.amychong.tourmanagementapp.mapper;

import com.amychong.tourmanagementapp.dto.booking.BookingResponseDTO;
import com.amychong.tourmanagementapp.dto.booking.BookingRequestDTO;
import com.amychong.tourmanagementapp.entity.booking.Booking;
import com.amychong.tourmanagementapp.service.EntityLookup;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import static com.amychong.tourmanagementapp.mapper.TourStartDateMapper.mapToTourStartDate;
import static com.amychong.tourmanagementapp.mapper.UserMapper.mapToUser;

@Mapper(componentModel = "spring", uses = UserMapper.class)
public interface BookingMapper extends GenericMapper<Booking, BookingResponseDTO> {

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
  BookingResponseDTO toDTO(Booking booking);

  default Booking toBooking(BookingRequestDTO requestBody, EntityLookup entityLookup) {
    Booking booking = new Booking();
    booking.setNumberOfParticipants(requestBody.getNumberOfParticipants());
    booking.setUser(mapToUser(requestBody.getUserId(), entityLookup));
    booking.setTourStartDate(
        mapToTourStartDate(requestBody.getTourId(), requestBody.getStartDateTime(), entityLookup));
    return booking;
  }

  static Booking mapToBooking(Integer bookingId, EntityLookup entityLookup) {
    return entityLookup.findBookingByIdOrThrow(bookingId);
  }
}
