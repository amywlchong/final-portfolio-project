package com.amychong.tourmanagementapp.dto;

public class PaymentExecutionRequestDTO {
    private final Integer bookingId;
    private final String orderId;

    // constructor
    public PaymentExecutionRequestDTO(Integer bookingId, String orderId) {
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
