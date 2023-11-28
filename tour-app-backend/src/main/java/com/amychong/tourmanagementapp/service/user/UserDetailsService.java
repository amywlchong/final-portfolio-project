package com.amychong.tourmanagementapp.service.user;

import com.amychong.tourmanagementapp.entity.user.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public interface UserDetailsService
    extends org.springframework.security.core.userdetails.UserDetailsService {
  UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;
}
