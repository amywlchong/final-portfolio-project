package com.amychong.tourmanagementapp.entity.user;

import java.util.Date;

public interface UserDetails extends org.springframework.security.core.userdetails.UserDetails {

    Integer getId();

    String getName();

    Role getRole();

    Long getPasswordChangedDate();
}
