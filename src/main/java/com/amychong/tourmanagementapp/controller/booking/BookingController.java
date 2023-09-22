package com.amychong.tourmanagementapp.controller.booking;

import com.amychong.tourmanagementapp.controller.generic.GenericController;
import com.amychong.tourmanagementapp.dto.booking.BookingResponseDTO;
import com.amychong.tourmanagementapp.dto.booking.BookingRequestDTO;
import com.amychong.tourmanagementapp.entity.booking.Booking;
import com.amychong.tourmanagementapp.service.booking.BookingService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController extends GenericController<Booking, BookingResponseDTO> {

    private final BookingService bookingService;

    @Autowired
    public BookingController(BookingService theBookingService) {
        super(theBookingService);
        bookingService = theBookingService;
    }

    @Override
    @PreAuthorize("hasAnyRole('LEAD_GUIDE','ADMIN')")
    @GetMapping
    public ResponseEntity<List<BookingResponseDTO>> getAll() {
        return super.getAll();
    }

    @Override
    @PreAuthorize("hasAnyRole('LEAD_GUIDE','ADMIN')")
    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingResponseDTO> getById(@Min(1) @PathVariable Integer bookingId) {
        return super.getById(bookingId);
    }

    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    @PostMapping
    public ResponseEntity<BookingResponseDTO> add(@NotNull @Valid @RequestBody BookingRequestDTO bookingRequest) {
        BookingResponseDTO newBooking = bookingService.create(bookingRequest);
        return new ResponseEntity<>(newBooking, HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    @PutMapping("/{bookingId}")
    public ResponseEntity<BookingResponseDTO> update(@Min(1) @PathVariable Integer bookingId, @NotNull @Valid @RequestBody BookingRequestDTO bookingRequest) {
        BookingResponseDTO updatedBooking = bookingService.update(bookingId, bookingRequest);
        return new ResponseEntity<>(updatedBooking, HttpStatus.OK);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{bookingId}")
    public ResponseEntity<String> delete(@Min(1) @PathVariable Integer bookingId) {
        return super.delete(bookingId);
    }
}
