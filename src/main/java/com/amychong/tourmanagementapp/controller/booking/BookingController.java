package com.amychong.tourmanagementapp.controller.booking;

import com.amychong.tourmanagementapp.controller.generic.GenericController;
import com.amychong.tourmanagementapp.dto.BookingDTO;
import com.amychong.tourmanagementapp.entity.booking.Booking;
import com.amychong.tourmanagementapp.service.booking.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
public class BookingController extends GenericController<Booking, BookingDTO> {

    private final BookingService bookingService;

    @Autowired
    public BookingController(BookingService theBookingService) {
        super(theBookingService);
        bookingService = theBookingService;
    }

    @PutMapping("/{bookingId}")
    public ResponseEntity<BookingDTO> updateBooking(@PathVariable Integer bookingId, @RequestBody Booking booking) {
        BookingDTO updatedBooking = bookingService.update(bookingId, booking);
        return new ResponseEntity<>(updatedBooking, HttpStatus.OK);
    }
}
