package com.amychong.tourmanagementapp.service.helper;

import org.apache.commons.lang3.StringUtils;

public class ValidationHelper{
    public static void validateId(Integer theId) {
        if (theId == null) {
            throw new IllegalArgumentException("ID must not be null.");
        }
        if (theId <= 0) {
            throw new IllegalArgumentException("ID must be a positive number.");
        }
    }

    public static void validateNotNull(Object obj, String message) {
        if (obj == null) {
            throw new IllegalArgumentException(message);
        }
    }

    public static void validateNotBlank(String str, String message) {
        if (StringUtils.isBlank(str)) {
            throw new IllegalArgumentException(message);
        }
    }
}
