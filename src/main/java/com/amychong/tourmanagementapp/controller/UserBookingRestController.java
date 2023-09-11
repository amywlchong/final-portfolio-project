package com.amychong.tourmanagementapp.controller;

import com.amychong.tourmanagementapp.dto.BookingDTO;
import com.amychong.tourmanagementapp.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users/{userId}/bookings")
public class UserBookingRestController {

    private BookingService bookingService;

    @Autowired
    public UserBookingRestController(BookingService theBookingService) {
        bookingService = theBookingService;
    }

    @GetMapping
    public ResponseEntity<List<BookingDTO>> getByUserId(@PathVariable Integer userId) {
        List<BookingDTO> bookingDTOs = bookingService.findByUserId(userId);
        return new ResponseEntity<>(bookingDTOs, HttpStatus.OK);
    }

}
