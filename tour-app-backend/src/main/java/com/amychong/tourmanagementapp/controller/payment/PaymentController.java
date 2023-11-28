package com.amychong.tourmanagementapp.controller.payment;

import com.amychong.tourmanagementapp.dto.payment.PaymentExecutionRequestDTO;
import com.amychong.tourmanagementapp.dto.payment.PaymentInitiationRequestDTO;
import com.amychong.tourmanagementapp.exception.PaymentProcessingException;
import com.amychong.tourmanagementapp.service.payment.PayPalServiceImpl;
import com.amychong.tourmanagementapp.service.payment.PaymentService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

  private final PaymentService paymentService;

  @Autowired
  public PaymentController(PayPalServiceImpl thePayPalService, PaymentService thePaymentService) {
    paymentService = thePaymentService;
  }

  @PreAuthorize("hasRole('CUSTOMER')")
  @PostMapping("/initiate")
  public ResponseEntity<String> initiatePayment(
      @NotNull @Valid @RequestBody PaymentInitiationRequestDTO requestBody) {
    Integer bookingId = requestBody.getBookingId();
    String response = paymentService.initiatePayment(bookingId);
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @PreAuthorize("hasRole('CUSTOMER')")
  @PostMapping("/execute")
  public ResponseEntity<String> executePayment(
      @NotNull @Valid @RequestBody PaymentExecutionRequestDTO requestBody) {
    Integer bookingId = requestBody.getBookingId();
    String orderId = requestBody.getOrderId();
    String response = paymentService.processPaymentAndBooking(bookingId, orderId);
    return new ResponseEntity<>(response, HttpStatus.OK);
  }
}
