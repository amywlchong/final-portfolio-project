package com.amychong.tourmanagementapp.controller;

import com.amychong.tourmanagementapp.dto.BookingDTO;
import com.amychong.tourmanagementapp.entity.Booking;
import com.amychong.tourmanagementapp.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
public class BookingRestController extends GenericRestController<Booking, BookingDTO> {

    private BookingService bookingService;

    @Autowired
    public BookingRestController(BookingService theBookingService) {
        super(theBookingService);
        bookingService = theBookingService;
    }

    @PutMapping("/{bookingId}")
    public ResponseEntity<BookingDTO> updateBooking(@PathVariable Integer bookingId, @RequestBody Booking booking) {
        BookingDTO updatedBooking = bookingService.update(bookingId, booking);
        return new ResponseEntity<>(updatedBooking, HttpStatus.OK);
    }
}
