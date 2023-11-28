package com.amychong.tourmanagementapp.service.payment;

import com.amychong.tourmanagementapp.entity.booking.Booking;
import org.json.JSONObject;

public interface PayPalService {
    String createOrder(Integer theBookingId, Booking booking);

    JSONObject capturePaymentForOrder(Integer theBookingId, String theOrderId);
}
