package com.amychong.tourmanagementapp.service.booking;

import com.amychong.tourmanagementapp.dto.booking.BookingResponseDTO;
import com.amychong.tourmanagementapp.dto.booking.BookingRequestDTO;
import com.amychong.tourmanagementapp.entity.booking.Booking;
import com.amychong.tourmanagementapp.service.generic.GenericService;

import java.util.List;

public interface BookingService extends GenericService<Booking, BookingResponseDTO> {

    List<BookingResponseDTO> findByUserId(Integer theUserId);

    List<BookingResponseDTO> findByTourId(Integer theTourId);

    BookingResponseDTO create(BookingRequestDTO inputBooking);

    BookingResponseDTO update(Integer inputBookingId, BookingRequestDTO inputBooking);

    void updateOrDeleteBookingAfterPaymentProcessing(Booking dbBooking, String transactionId, String status);
}
