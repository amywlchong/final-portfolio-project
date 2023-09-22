package com.amychong.tourmanagementapp.service.payment;


public interface PaymentService {

    String initiatePayment(Integer bookingId);

    String processPaymentAndBooking(Integer bookingId, String orderId);
}
