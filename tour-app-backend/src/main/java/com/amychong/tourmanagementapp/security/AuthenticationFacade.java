package com.amychong.tourmanagementapp.security;

import org.springframework.security.core.Authentication;

public interface AuthenticationFacade {
  Authentication getAuthentication();
}
