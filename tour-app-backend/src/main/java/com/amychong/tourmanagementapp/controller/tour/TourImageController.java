package com.amychong.tourmanagementapp.controller.tour;

import com.amychong.tourmanagementapp.dto.tour.TourImageResponseDTO;
import com.amychong.tourmanagementapp.service.tour.TourImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tours/{tourId}/images")
public class TourImageController {

  private final TourImageService tourImageService;

  @Autowired
  public TourImageController(TourImageService tourImageService) {
    this.tourImageService = tourImageService;
  }

  @GetMapping(value = "/{imageId}", produces = MediaType.IMAGE_JPEG_VALUE)
  public byte[] getTourImage(
      @PathVariable("tourId") Integer tourId, @PathVariable("imageId") Integer imageId) {
    return tourImageService.getTourImageBytes(tourId, imageId);
  }

  @PreAuthorize("hasAnyRole('LEAD_GUIDE','ADMIN')")
  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<List<TourImageResponseDTO>> uploadTourImages(
      @PathVariable("tourId") Integer tourId,
      @RequestParam("files") List<MultipartFile> files,
      @RequestParam(value = "coverImage", required = false) Optional<String> coverImageNameOpt) {

    String coverImageName = coverImageNameOpt.orElse("");
    return new ResponseEntity<>(
        tourImageService.uploadTourImages(tourId, files, coverImageName), HttpStatus.CREATED);
  }

  @PreAuthorize("hasAnyRole('LEAD_GUIDE','ADMIN')")
  @DeleteMapping("/{imageId}")
  public ResponseEntity<String> deleteTourImage(
      @PathVariable("tourId") Integer tourId, @PathVariable("imageId") Integer imageId) {
    tourImageService.deleteTourImageById(tourId, imageId);
    return new ResponseEntity<>("Successfully deleted image id " + imageId, HttpStatus.OK);
  }
}
