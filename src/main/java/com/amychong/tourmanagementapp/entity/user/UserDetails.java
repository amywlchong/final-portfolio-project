package com.amychong.tourmanagementapp.entity.user;

public interface UserDetails extends org.springframework.security.core.userdetails.UserDetails {

    Integer getId();

    String getName();

    Role getRole();

    Long getPasswordChangedDate();
}
