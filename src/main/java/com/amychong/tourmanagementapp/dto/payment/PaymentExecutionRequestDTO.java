package com.amychong.tourmanagementapp.dto.payment;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class PaymentExecutionRequestDTO {

    @NotNull(message = "Booking ID is required")
    @Positive(message = "Booking ID must be positive")
    private final Integer bookingId;

    @NotBlank(message = "Order ID is required")
    @Size(max = 19, message = "Order ID should have at most 19 characters")
    private final String orderId;

    // constructor
    @JsonCreator
    public PaymentExecutionRequestDTO(@JsonProperty("bookingId") Integer bookingId, @JsonProperty("orderId") String orderId) {
        this.bookingId = bookingId;
        this.orderId = orderId;
    }

    // getters
    public Integer getBookingId() {
        return bookingId;
    }

    public String getOrderId() {
        return orderId;
    }

    // toString method
    @Override
    public String toString() {
        return "PaymentExecutionRequestDTO{" +
                "bookingId=" + bookingId +
                ", orderId='" + orderId + '\'' +
                '}';
    }
}
