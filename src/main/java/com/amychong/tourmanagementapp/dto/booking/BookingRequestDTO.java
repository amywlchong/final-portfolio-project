package com.amychong.tourmanagementapp.dto.booking;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;

public class BookingRequestDTO {

    @Positive(message = "Number of participants must be positive")
    private final int numberOfParticipants;

    @NotNull(message = "User ID is required")
    @Positive(message = "User ID must be positive")
    private final Integer userId;

    @NotNull(message = "Tour ID is required")
    @Positive(message = "Tour ID must be positive")
    private final Integer tourId;

    @NotNull(message = "Start date time is required")
    @Future(message = "Start date time must be in the future")
    private final LocalDateTime startDateTime;

    public BookingRequestDTO(int numberOfParticipants, Integer userId, Integer tourId, LocalDateTime startDateTime) {
        this.numberOfParticipants = numberOfParticipants;
        this.userId = userId;
        this.tourId = tourId;
        this.startDateTime = startDateTime;
    }

    public int getNumberOfParticipants() {
        return numberOfParticipants;
    }

    public Integer getUserId() {
        return userId;
    }

    public Integer getTourId() {
        return tourId;
    }

    public LocalDateTime getStartDateTime() {
        return startDateTime;
    }

    @Override
    public String toString() {
        return "BookingRequestDTO{" +
                "numberOfParticipants=" + numberOfParticipants +
                ", userId=" + userId +
                ", tourId=" + tourId +
                ", startDateTime=" + startDateTime +
                '}';
    }
}
