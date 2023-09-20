package com.amychong.tourmanagementapp.service.booking;

import com.amychong.tourmanagementapp.dto.BookingDTO;
import com.amychong.tourmanagementapp.entity.booking.Booking;
import com.amychong.tourmanagementapp.entity.user.UserDetails;
import com.amychong.tourmanagementapp.service.generic.GenericService;

import java.util.List;

public interface BookingService extends GenericService<Booking, BookingDTO> {

    Booking validateBookingIdAndFindBooking(Integer bookingId);

    List<BookingDTO> findByUserId(Integer theUserId);

    List<BookingDTO> findByTourId(Integer theTourId);

    BookingDTO update(Integer inputBookingId, Booking inputBooking);

    void updateOrDeleteBookingAfterPaymentProcessing(Booking dbBooking, String transactionId, String status);
}
