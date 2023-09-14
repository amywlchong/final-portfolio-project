package com.amychong.tourmanagementapp.service.helper;

import com.amychong.tourmanagementapp.entity.interfaces.HasUser;
import com.amychong.tourmanagementapp.entity.user.User;

import java.util.Optional;

public class UserHelper {

    public static Integer extractUserId(HasUser entity) {
        return Optional.ofNullable(entity.getUser())
                .map(User::getId)
                .orElseThrow(() -> new IllegalArgumentException("User id must not be null."));
    }
}
