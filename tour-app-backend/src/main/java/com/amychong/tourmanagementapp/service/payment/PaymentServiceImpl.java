package com.amychong.tourmanagementapp.service.payment;

import com.amychong.tourmanagementapp.entity.booking.Booking;
import com.amychong.tourmanagementapp.service.booking.BookingService;
import com.amychong.tourmanagementapp.service.EntityLookup;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PaymentServiceImpl implements PaymentService{

    private final PayPalService payPalService;

    private final BookingService bookingService;

    private final EntityLookup entityLookup;

    @Autowired
    public PaymentServiceImpl(PayPalService thePayPalService, BookingService theBookingService, EntityLookup theEntityLookup) {
        payPalService = thePayPalService;
        bookingService = theBookingService;
        entityLookup = theEntityLookup;
    }

    @Override
    public String initiatePayment(Integer inputBookingId) {
        Booking dbBooking = entityLookup.findBookingByIdOrThrow(inputBookingId);
        return payPalService.createOrder(inputBookingId, dbBooking);
    }

    @Override
    @Transactional
    public String processPaymentAndBooking(Integer inputBookingId, String inputOrderId) {
        entityLookup.findBookingByIdOrThrow(inputBookingId);   // validate booking exists

        JSONObject response = payPalService.capturePaymentForOrder(inputBookingId, inputOrderId);
        String transactionId = response.getString("transactionId");
        String status = response.getString("status");
        Integer responseBookingId = Integer.parseInt(response.getString("referenceId"));
        Booking dbBooking = entityLookup.findBookingByIdOrThrow(responseBookingId);

        bookingService.updateOrDeleteBookingAfterPaymentProcessing(dbBooking, transactionId, status);

        return response.toString();
    }
}
