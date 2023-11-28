package com.amychong.tourmanagementapp.controller.booking;

import com.amychong.tourmanagementapp.dto.booking.BookingResponseDTO;
import com.amychong.tourmanagementapp.service.booking.BookingService;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users/{userId}/bookings")
public class UserBookingController {

    private final BookingService bookingService;

    @Autowired
    public UserBookingController(BookingService theBookingService) {
        bookingService = theBookingService;
    }

    @PreAuthorize("hasAnyRole('LEAD_GUIDE','ADMIN')")
    @GetMapping
    public ResponseEntity<List<BookingResponseDTO>> getByUserId(@Min(1) @PathVariable Integer userId) {
        List<BookingResponseDTO> bookingDTOs = bookingService.findByUserId(userId);
        return new ResponseEntity<>(bookingDTOs, HttpStatus.OK);
    }

}
