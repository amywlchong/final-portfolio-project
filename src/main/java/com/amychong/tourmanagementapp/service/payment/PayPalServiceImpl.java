package com.amychong.tourmanagementapp.service.payment;

import com.amychong.tourmanagementapp.entity.booking.Booking;
import org.json.JSONObject;
import org.json.JSONArray;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;

@Service
public class PayPalServiceImpl implements PayPalService {

    private final String paypalApiUrl;

    private final String paypalAuthToken;

    @Autowired
    public PayPalServiceImpl(@Value("${paypal.api.url}") String paypalApiUrl, @Value("${paypal.authorization.token}") String paypalAuthToken) {
        this.paypalApiUrl = paypalApiUrl;
        this.paypalAuthToken = paypalAuthToken;
    }

    @Override
    public String createOrder(Integer inputBookingId, Booking dbBooking) throws IOException {
        URL url = new URL(paypalApiUrl);
        HttpURLConnection httpConn = (HttpURLConnection) url.openConnection();
        httpConn.setRequestMethod("POST");

        // Set headers
        httpConn.setRequestProperty("Content-Type", "application/json");
        httpConn.setRequestProperty("PayPal-Request-Id", UUID.randomUUID().toString());
        httpConn.setRequestProperty("Authorization", paypalAuthToken);

        // Construct payload dynamically and send request
        Map<String, Object> payload = new HashMap<>();

        payload.put("intent", "CAPTURE");

        Map<String, Object> amountMap = new HashMap<>();
        amountMap.put("currency_code", "HKD");
        amountMap.put("value", dbBooking.getTotalPrice());

        Map<String, Object> purchaseUnit = new HashMap<>();
        purchaseUnit.put("reference_id", inputBookingId);
        purchaseUnit.put("amount", amountMap);

        payload.put("purchase_units", Collections.singletonList(purchaseUnit));

        Map<String, Object> experienceContext = new HashMap<>();
        experienceContext.put("payment_method_preference", "IMMEDIATE_PAYMENT_REQUIRED");
        experienceContext.put("brand_name", "ScenicSymphony Tours, Inc.");
        experienceContext.put("landing_page", "LOGIN");
        experienceContext.put("user_action", "PAY_NOW");
        experienceContext.put("return_url", "https://example.com/returnUrl");
        experienceContext.put("cancel_url", "https://example.com/cancelUrl");

        Map<String, Object> paypalSource = new HashMap<>();
        paypalSource.put("experience_context", experienceContext);

        Map<String, Object> paymentSource = new HashMap<>();
        paymentSource.put("paypal", paypalSource);

        payload.put("payment_source", paymentSource);

        ObjectMapper objectMapper = new ObjectMapper();
        String requestBody = objectMapper.writeValueAsString(payload);

        httpConn.setDoOutput(true);
        try (OutputStream os = httpConn.getOutputStream();
             OutputStreamWriter writer = new OutputStreamWriter(os)) {
            writer.write(requestBody);
            writer.flush();
        }

        // Process response
        InputStream responseStream = httpConn.getResponseCode() / 100 == 2
                ? httpConn.getInputStream()
                : httpConn.getErrorStream();
        Scanner s = new Scanner(responseStream).useDelimiter("\\A");
        String fullResponse = s.hasNext() ? s.next() : "";
        System.out.println("fullResponse: " + fullResponse);

        // Parse the JSON response and get the 'id' value
        JSONObject jsonResponse = new JSONObject(fullResponse);
        String id = jsonResponse.optString("id", "");

        return id;
    }

    @Override
    public JSONObject capturePaymentForOrder(Integer inputBookingId, String inputOrderId) throws IOException {
        URL url = new URL(paypalApiUrl + inputOrderId + "/capture");
        HttpURLConnection httpConn = (HttpURLConnection) url.openConnection();
        httpConn.setRequestMethod("POST");
        httpConn.setRequestProperty("Content-Type", "application/json");
        httpConn.setRequestProperty("PayPal-Request-Id", inputBookingId.toString());
        httpConn.setRequestProperty("Authorization", paypalAuthToken);

        String fullResponse = "";

        try (InputStream responseStream = httpConn.getResponseCode() / 100 == 2
                ? httpConn.getInputStream()
                : httpConn.getErrorStream();
             Scanner s = new Scanner(responseStream).useDelimiter("\\A")) {

            fullResponse = s.hasNext() ? s.next() : "";
            System.out.println("fullResponse: "+ fullResponse);
        }

        // Parse the original response
        JSONObject jsonResponse = new JSONObject(fullResponse);

        // Extract the necessary fields and create a minimal response
        JSONObject minimalResponse = new JSONObject();
        minimalResponse.put("orderId", jsonResponse.getString("id"));
        minimalResponse.put("status", jsonResponse.getString("status"));

        JSONArray purchaseUnits = jsonResponse.getJSONArray("purchase_units");
        if (purchaseUnits.length() > 0) {
            JSONObject firstUnit = purchaseUnits.getJSONObject(0);
            minimalResponse.put("referenceId", firstUnit.getString("reference_id"));

            String captureTransactionId = firstUnit.getJSONObject("payments").getJSONArray("captures").getJSONObject(0).getString("id");
            minimalResponse.put("transactionId", captureTransactionId);

            JSONObject captures = firstUnit.getJSONObject("payments").getJSONArray("captures").getJSONObject(0).getJSONObject("amount");
            minimalResponse.put("amount", captures);
        }

        return minimalResponse;
    }
}
