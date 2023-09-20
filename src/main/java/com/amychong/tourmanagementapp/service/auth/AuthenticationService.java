package com.amychong.tourmanagementapp.service.auth;

import com.amychong.tourmanagementapp.dto.AuthenticationRequestDTO;
import com.amychong.tourmanagementapp.dto.AuthenticationResponseDTO;
import com.amychong.tourmanagementapp.dto.RegisterRequestDTO;
import com.amychong.tourmanagementapp.entity.user.Role;
import com.amychong.tourmanagementapp.entity.user.User;

public interface AuthenticationService {
    AuthenticationResponseDTO register(RegisterRequestDTO request);

    AuthenticationResponseDTO authenticate(AuthenticationRequestDTO request);

    AuthenticationResponseDTO updatePassword(String oldPassword, String newPassword);

    boolean verifyAuthenticatedUserHasRole(Role expectedRole);

    boolean verifyAuthenticatedUserHasId(Integer expectedUserId);

    User getAuthenticatedUser();
}
