package com.amychong.tourmanagementapp.controller.booking;

import com.amychong.tourmanagementapp.controller.generic.GenericController;
import com.amychong.tourmanagementapp.dto.BookingDTO;
import com.amychong.tourmanagementapp.entity.booking.Booking;
import com.amychong.tourmanagementapp.service.booking.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController extends GenericController<Booking, BookingDTO> {

    private final BookingService bookingService;

    @Autowired
    public BookingController(BookingService theBookingService) {
        super(theBookingService);
        bookingService = theBookingService;
    }

    @Override
    @PreAuthorize("hasAnyRole('LEAD_GUIDE','ADMIN')")
    @GetMapping
    public ResponseEntity<List<BookingDTO>> getAll() {
        return super.getAll();
    }

    @Override
    @PreAuthorize("hasAnyRole('LEAD_GUIDE','ADMIN')")
    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingDTO> getById(@PathVariable Integer bookingId) {
        return super.getById(bookingId);
    }

    @Override
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    @PostMapping
    public ResponseEntity<BookingDTO> add(@RequestBody Booking booking) {
        return super.add(booking);
    }

    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    @PutMapping("/{bookingId}")
    public ResponseEntity<BookingDTO> update(@PathVariable Integer bookingId, @RequestBody Booking booking) {
        BookingDTO updatedBooking = bookingService.update(bookingId, booking);
        return new ResponseEntity<>(updatedBooking, HttpStatus.OK);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{bookingId}")
    public ResponseEntity<String> delete(@PathVariable Integer bookingId) {
        return super.delete(bookingId);
    }
}
