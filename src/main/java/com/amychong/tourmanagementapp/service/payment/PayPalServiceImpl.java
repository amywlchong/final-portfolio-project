package com.amychong.tourmanagementapp.service.payment;

import com.amychong.tourmanagementapp.entity.booking.Booking;
import com.amychong.tourmanagementapp.exception.PaymentProcessingException;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONArray;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;

@Service
public class PayPalServiceImpl implements PayPalService {

    private static final int HTTP_OK = HttpURLConnection.HTTP_OK;
    private static final int HTTP_CREATED = HttpURLConnection.HTTP_CREATED;

    private final String clientId;
    private final String clientSecret;
    private final String tokenUrl;

    private final String paypalApiUrl;
    private String paypalAuthToken;
    private long tokenExpiry = 0;

    @Autowired
    public PayPalServiceImpl(@Value("${paypal.api.url}") String paypalApiUrl,
                             @Value("${paypal.client.id}") String clientId,
                             @Value("${paypal.client.secret}") String clientSecret,
                             @Value("${paypal.api.token.url}") String tokenUrl) {
        this.paypalApiUrl = paypalApiUrl;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.tokenUrl = tokenUrl;
        refreshToken();
    }

    @Override
    public String createOrder(Integer inputBookingId, Booking dbBooking) {
        if (System.currentTimeMillis() >= tokenExpiry) {
            refreshToken();
        }

        try {
            HttpURLConnection httpConn = setUpConnection(paypalApiUrl, "POST", inputBookingId);

            String requestBody = constructRequestBody(inputBookingId, dbBooking);
            sendRequest(httpConn, requestBody);

            int responseCode = httpConn.getResponseCode();
            String fullResponse = extractResponse(httpConn);

            if (responseCode != HTTP_OK) {
                throw new PaymentProcessingException("Error creating order in PayPal for booking: " + inputBookingId);
            }

            return extractOrderId(fullResponse);

        } catch (JsonProcessingException e) {
            throw new PaymentProcessingException("Error serializing order data for booking: " + inputBookingId, e);
        } catch (JSONException | IOException e) {
            throw new PaymentProcessingException("Error in communication with PayPal for booking: " + inputBookingId, e);
        }
    }

    @Override
    public JSONObject capturePaymentForOrder(Integer inputBookingId, String inputOrderId) {
        if (System.currentTimeMillis() >= tokenExpiry) {
            refreshToken();
        }

        try {
            HttpURLConnection httpConn = setUpConnection(paypalApiUrl + inputOrderId + "/capture", "POST", inputBookingId);

            int responseCode = httpConn.getResponseCode();
            String fullResponse = extractResponse(httpConn);

            if (responseCode != HTTP_OK && responseCode != HTTP_CREATED) {
                throw new PaymentProcessingException("Error capturing payment in PayPal for order: " + inputOrderId);
            }

            return extractCaptureResponse(fullResponse);

        } catch (JSONException | IOException e) {
            throw new PaymentProcessingException("Error in communication with PayPal for order: " + inputOrderId, e);
        }
    }

    private HttpURLConnection setUpConnection(String apiUrl, String requestMethod, Integer inputBookingId) throws IOException {
        URL url = new URL(apiUrl);
        HttpURLConnection httpConn = (HttpURLConnection) url.openConnection();
        httpConn.setRequestMethod(requestMethod);
        httpConn.setRequestProperty("Content-Type", "application/json");
        httpConn.setRequestProperty("PayPal-Request-Id", inputBookingId.toString());
        httpConn.setRequestProperty("Authorization", paypalAuthToken);
        return httpConn;
    }

    private String constructRequestBody(Integer inputBookingId, Booking dbBooking) throws JsonProcessingException {
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
        return objectMapper.writeValueAsString(payload);
    }

    private void sendRequest(HttpURLConnection httpConn, String requestBody) throws IOException {
        httpConn.setDoOutput(true);
        try (OutputStream os = httpConn.getOutputStream();
             OutputStreamWriter writer = new OutputStreamWriter(os)) {
            writer.write(requestBody);
            writer.flush();
        }
    }

    private String extractResponse(HttpURLConnection httpConn) throws IOException {
        String fullResponse;
        try (InputStream responseStream = httpConn.getResponseCode() / 100 == 2
                ? httpConn.getInputStream()
                : httpConn.getErrorStream();
             Scanner s = new Scanner(responseStream).useDelimiter("\\A")) {
            fullResponse = s.hasNext() ? s.next() : "";
            System.out.println("fullResponse: " + fullResponse);
        }
        return fullResponse;
    }

    private String extractOrderId(String fullResponse) {
        JSONObject jsonResponse = new JSONObject(fullResponse);

        if (!jsonResponse.has("id") || jsonResponse.getString("id").isEmpty()) {
            throw new PaymentProcessingException("Expected 'id' field not present in PayPal response.");
        }

        return jsonResponse.getString("id");
    }

    private JSONObject extractCaptureResponse(String fullResponse) {
        JSONObject jsonResponse = new JSONObject(fullResponse);

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

    private void refreshToken() {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        headers.setBasicAuth(clientId, clientSecret);

        HttpEntity<String> request = new HttpEntity<>("grant_type=client_credentials", headers);
        ResponseEntity<TokenResponse> response = restTemplate.postForEntity(tokenUrl, request, TokenResponse.class);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            TokenResponse tokenResponse = response.getBody();

            this.paypalAuthToken = "Bearer " + tokenResponse.getAccessToken();
            this.tokenExpiry = System.currentTimeMillis() + (tokenResponse.getExpiresIn() * 1000);

            System.out.println("New PayPal Token: " + paypalAuthToken);
            System.out.println("Token Expiry Time: " + tokenExpiry);
        } else {
            System.err.println("Failed to refresh PayPal token. Status code: " + response.getStatusCode());
        }
    }

    private static class TokenResponse {
        @JsonProperty("access_token")
        private String access_token;

        @JsonProperty("expires_in")
        private long expires_in;

        public String getAccessToken() {
            return access_token;
        }

        public long getExpiresIn() {
            return expires_in;
        }
    }
}
