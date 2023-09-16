package com.amychong.tourmanagementapp.service.payment;

import com.amychong.tourmanagementapp.entity.booking.Booking;
import com.amychong.tourmanagementapp.service.booking.BookingService;
import com.amychong.tourmanagementapp.service.helper.ValidationHelper;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;

@Service
public class PaymentServiceImpl implements PaymentService{

    private PayPalService payPalService;

    private BookingService bookingService;

    @Autowired
    public PaymentServiceImpl(PayPalService thePayPalService, BookingService theBookingService) {
        payPalService = thePayPalService;
        bookingService = theBookingService;
    }

    @Override
    public String initiatePayment(Integer inputBookingId) throws IOException {
        Booking dbBooking = bookingService.validateBookingIdAndFindBooking(inputBookingId);
        return payPalService.createOrder(inputBookingId, dbBooking);
    }

    @Override
    @Transactional
    public String processPaymentAndBooking(Integer inputBookingId, String inputOrderId) throws IOException {
        bookingService.validateBookingIdAndFindBooking(inputBookingId);
        ValidationHelper.validateNotBlank(inputOrderId, "Order id must not be null or blank.");

        JSONObject response = payPalService.capturePaymentForOrder(inputBookingId, inputOrderId);
        String transactionId = response.getString("transactionId");
        String status = response.getString("status");
        Integer responseBookingId = Integer.parseInt(response.getString("referenceId"));
        Booking dbBooking = bookingService.validateBookingIdAndFindBooking(responseBookingId);

        bookingService.updateOrDeleteBookingAfterPaymentProcessing(dbBooking, transactionId, status);

        return response.toString();
    }
}
