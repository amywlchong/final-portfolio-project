package com.amychong.tourmanagementapp.service.payment;

import java.io.IOException;


public interface PaymentService {

    String initiatePayment(Integer bookingId) throws IOException;

    String processPaymentAndBooking(Integer bookingId, String orderId) throws IOException;
}
