package com.amychong.tourmanagementapp.service;

import com.amychong.tourmanagementapp.dto.UserDTO;
import com.amychong.tourmanagementapp.entity.HasUser;
import com.amychong.tourmanagementapp.entity.User;
import com.amychong.tourmanagementapp.exception.NotFoundException;
import com.amychong.tourmanagementapp.repository.UserRepository;

import java.util.Optional;

public class UserHelper {

    protected static Integer extractUserId(HasUser entity) {
        return Optional.ofNullable(entity.getUser())
                .map(User::getId)
                .orElseThrow(() -> new IllegalArgumentException("User id must not be null."));
    }

    protected static void validateUserRole(Integer userId, UserRepository userRepository, String message, String... expectedRoles) {
        Optional<User> existingUser = userRepository.findById(userId);
        if (!existingUser.isPresent()) {
            throw new NotFoundException("Did not user id - " + userId);
        }
        for (String validRole : expectedRoles) {
            if (existingUser.get().getUserRole().equals(validRole)) {
                return;  // If a matching role is found, we exit early
            }
        }
        throw new RuntimeException(message);
    }
}
