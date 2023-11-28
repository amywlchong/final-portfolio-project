package com.amychong.tourmanagementapp.dto.payment;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class PaymentInitiationRequestDTO {

  @NotNull(message = "Booking ID is required")
  @Positive(message = "Booking ID must be positive")
  private final Integer bookingId;

  @JsonCreator
  public PaymentInitiationRequestDTO(@JsonProperty("bookingId") Integer bookingId) {
    this.bookingId = bookingId;
  }

  public Integer getBookingId() {
    return bookingId;
  }

  @Override
  public String toString() {
    return "PaymentInitiationRequestDTO{" + "bookingId=" + bookingId + '}';
  }
}
