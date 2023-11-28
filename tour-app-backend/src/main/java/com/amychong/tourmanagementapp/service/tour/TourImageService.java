package com.amychong.tourmanagementapp.service.tour;

import com.amychong.tourmanagementapp.dto.tour.TourImageResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface TourImageService {

  byte[] getTourImageBytes(Integer tourId, Integer imageId);

  List<TourImageResponseDTO> uploadTourImages(
      Integer tourId, List<MultipartFile> files, String coverImageName);

  void deleteTourImageById(Integer inputTourId, Integer imageId);
}
