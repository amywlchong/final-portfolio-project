package com.amychong.tourmanagementapp.controller.user;

import com.amychong.tourmanagementapp.dto.booking.BookingResponseDTO;
import com.amychong.tourmanagementapp.dto.review.ReviewResponseDTO;
import com.amychong.tourmanagementapp.dto.schedule.ScheduleResponseDTO;
import com.amychong.tourmanagementapp.dto.user.UserResponseDTO;
import com.amychong.tourmanagementapp.entity.user.User;
import com.amychong.tourmanagementapp.mapper.UserMapper;
import com.amychong.tourmanagementapp.service.auth.AuthenticationService;
import com.amychong.tourmanagementapp.service.booking.BookingService;
import com.amychong.tourmanagementapp.service.review.ReviewService;
import com.amychong.tourmanagementapp.service.schedule.TourGuideScheduleService;
import com.amychong.tourmanagementapp.service.user.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/me")
public class UserSelfServiceController {

    private final UserService userService;
    private final AuthenticationService authService;
    private final TourGuideScheduleService tourGuideScheduleService;
    private final BookingService bookingService;
    private final ReviewService reviewService;
    private final UserMapper userMapper;

    @Autowired
    public UserSelfServiceController(UserService userService, AuthenticationService authService, TourGuideScheduleService tourGuideScheduleService, BookingService bookingService, ReviewService reviewService, UserMapper userMapper) {
        this.userService = userService;
        this.authService = authService;
        this.tourGuideScheduleService = tourGuideScheduleService;
        this.bookingService = bookingService;
        this.reviewService = reviewService;
        this.userMapper = userMapper;
    }

    @GetMapping("/profile-details")
    public ResponseEntity<UserResponseDTO> getMyProfile() {
        User authenticatedUser = authService.getAuthenticatedUser();
        return new ResponseEntity<>(userService.findByIdOrThrow(authenticatedUser.getId()), HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('GUIDE', 'LEAD_GUIDE')")
    @GetMapping("/schedules")
    public ResponseEntity<List<ScheduleResponseDTO>> getMySchedules() {
        User authenticatedUser = authService.getAuthenticatedUser();
        return new ResponseEntity<>(tourGuideScheduleService.findByUserId(authenticatedUser.getId()), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings() {
        User authenticatedUser = authService.getAuthenticatedUser();
        return new ResponseEntity<>(bookingService.findByUserId(authenticatedUser.getId()), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/reviews")
    public ResponseEntity<List<ReviewResponseDTO>> getMyReviews() {
        User authenticatedUser = authService.getAuthenticatedUser();
        return new ResponseEntity<>(reviewService.findByUserId(authenticatedUser.getId()), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @PutMapping("/active")
    public ResponseEntity<UserResponseDTO> updateActiveStatus(@NotNull @Valid @RequestBody Map<String, Boolean> requestBody) {
        User authenticatedUser = authService.getAuthenticatedUser();
        UserResponseDTO updatedUser = userService.updateActiveStatus(authenticatedUser.getId(), requestBody.get("active"));
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }
}
