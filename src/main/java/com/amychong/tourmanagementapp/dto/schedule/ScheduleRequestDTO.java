package com.amychong.tourmanagementapp.dto.schedule;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;

public class ScheduleRequestDTO {

    @NotNull(message = "User ID is required")
    @Positive(message = "User ID must be positive")
    private final Integer userId;

    @NotNull(message = "Tour ID is required")
    @Positive(message = "Tour ID must be positive")
    private final Integer tourId;

    @NotNull(message = "Start date time is required")
    @Future(message = "Start date time must be in the future")
    private final LocalDateTime startDateTime;

    public ScheduleRequestDTO(Integer userId, Integer tourId, LocalDateTime startDateTime) {
        this.userId = userId;
        this.tourId = tourId;
        this.startDateTime = startDateTime;
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
        return "ScheduleRequestDTO{" +
                "userId=" + userId +
                ", tourId=" + tourId +
                ", startDateTime=" + startDateTime +
                '}';
    }
}
