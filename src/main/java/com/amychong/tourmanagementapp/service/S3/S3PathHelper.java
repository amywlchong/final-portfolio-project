package com.amychong.tourmanagementapp.service.S3;

public class S3PathHelper {

    public static String imagePath(Integer tourId, String imageName) {
        return "tour" + tourId + "/" + imageName;
    }
}
