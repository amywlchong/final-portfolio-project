package com.amychong.tourmanagementapp.service;

import com.amychong.tourmanagementapp.dto.BookingDTO;
import com.amychong.tourmanagementapp.entity.Booking;

import java.util.List;

public interface BookingService extends GenericService<Booking, BookingDTO> {
    List<BookingDTO> findByUserId(Integer theUserId);

    List<BookingDTO> findByTourId(Integer theTourId);

    BookingDTO update(Integer inputBookingId, Booking inputBooking);
}
