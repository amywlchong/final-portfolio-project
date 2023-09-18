package com.amychong.tourmanagementapp.controller.payment;

import com.amychong.tourmanagementapp.dto.PaymentExecutionRequestDTO;
import com.amychong.tourmanagementapp.service.payment.PayPalServiceImpl;
import com.amychong.tourmanagementapp.service.payment.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    @Autowired
    public PaymentController(PayPalServiceImpl thePayPalService, PaymentService thePaymentService) {
        paymentService = thePaymentService;
    }

    @PostMapping("/initiate")
    public ResponseEntity<String> initiatePayment(@RequestBody Map<String, Integer> requestBody) {
        Integer bookingId = requestBody.get("bookingId");
        try {
            String response = paymentService.initiatePayment(bookingId);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error initiating payment with booking id: " + bookingId, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/execute")
    public ResponseEntity<String> executePayment(@RequestBody PaymentExecutionRequestDTO requestBody) {
        Integer bookingId = requestBody.getBookingId();
        String orderId = requestBody.getOrderId();
        try {
            String response = paymentService.processPaymentAndBooking(bookingId, orderId);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error executing payment with booking id: " + bookingId +
                    ", order id: " + orderId, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
