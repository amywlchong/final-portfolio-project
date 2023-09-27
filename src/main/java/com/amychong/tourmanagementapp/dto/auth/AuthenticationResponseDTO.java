package com.amychong.tourmanagementapp.dto.auth;

import com.amychong.tourmanagementapp.entity.user.Role;

public class AuthenticationResponseDTO {

    private String token;

    private Integer userId;

    private String userName;

    private Boolean userActive;

    private Role userRole;

    public AuthenticationResponseDTO() {
    }

    public AuthenticationResponseDTO(String token, Integer userId, String userName, Boolean userActive, Role userRole) {
        this.token = token;
        this.userId = userId;
        this.userName = userName;
        this.userActive = userActive;
        this.userRole = userRole;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Boolean getUserActive() {
        return userActive;
    }

    public void setUserActive(Boolean userActive) {
        this.userActive = userActive;
    }

    public Role getUserRole() {
        return userRole;
    }

    public void setUserRole(Role userRole) {
        this.userRole = userRole;
    }

    @Override
    public String toString() {
        return "AuthenticationResponseDTO{" +
                "token='" + token + '\'' +
                ", userId=" + userId +
                ", userName='" + userName + '\'' +
                ", userActive=" + userActive +
                ", userRole=" + userRole +
                '}';
    }
}
