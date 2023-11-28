package com.amychong.tourmanagementapp.dto.auth;

public class AuthenticationResponseDTO {

    private String token;

    public AuthenticationResponseDTO() {
    }

    public AuthenticationResponseDTO(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    @Override
    public String toString() {
        return "AuthenticationResponseDTO{" +
                "token='" + token + '\'' +
                '}';
    }
}
