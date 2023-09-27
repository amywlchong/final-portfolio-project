package com.amychong.tourmanagementapp.dto.review;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;

public class ReviewRequestDTO {

    @Size(min = 5, max = 2000, message = "Review must be between 5 and 2000 characters long")
    private final String review;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private final Integer rating;

    @NotNull(message = "Booking ID is required")
    @Positive(message = "Booking ID must be positive")
    private final Integer bookingId;

    @JsonCreator
    public ReviewRequestDTO(@JsonProperty("review") String review, @JsonProperty("rating") Integer rating, @JsonProperty("bookingId") Integer bookingId) {
        this.review = review;
        this.rating = rating;
        this.bookingId = bookingId;
    }

    public String getReview() {
        return review;
    }

    public Integer getRating() {
        return rating;
    }

    public Integer getBookingId() {
        return bookingId;
    }

    @Override
    public String toString() {
        return "ReviewRequestDTO{" +
                "review='" + review + '\'' +
                ", rating=" + rating +
                ", bookingId=" + bookingId +
                '}';
    }
}
