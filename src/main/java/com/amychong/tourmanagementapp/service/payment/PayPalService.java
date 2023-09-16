package com.amychong.tourmanagementapp.service.payment;

import com.amychong.tourmanagementapp.entity.booking.Booking;
import org.json.JSONObject;

import java.io.IOException;

public interface PayPalService {
    String createOrder(Integer theBookingId, Booking booking) throws IOException;

    JSONObject capturePaymentForOrder(Integer theBookingId, String theOrderId) throws IOException;
}
