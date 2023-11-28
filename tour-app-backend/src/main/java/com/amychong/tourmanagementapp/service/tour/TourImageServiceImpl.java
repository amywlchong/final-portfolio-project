package com.amychong.tourmanagementapp.service.tour;

import com.amychong.tourmanagementapp.dto.tour.TourImageResponseDTO;
import com.amychong.tourmanagementapp.entity.tour.Tour;
import com.amychong.tourmanagementapp.entity.tour.TourImage;
import com.amychong.tourmanagementapp.exception.S3OperationException;
import com.amychong.tourmanagementapp.mapper.TourImageMapper;
import com.amychong.tourmanagementapp.repository.tour.TourImageRepository;
import com.amychong.tourmanagementapp.repository.tour.TourRepository;
import com.amychong.tourmanagementapp.service.EntityLookup;
import com.amychong.tourmanagementapp.service.S3.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import static com.amychong.tourmanagementapp.service.S3.S3PathHelper.imagePath;

@Service
public class TourImageServiceImpl implements TourImageService {

  private final TourImageRepository tourImageRepository;
  private final TourService tourService;
  private final S3Service s3Service;
  private final TourImageMapper tourImageMapper;
  private final EntityLookup entityLookup;

  @Autowired
  public TourImageServiceImpl(
      TourImageRepository theTourImageRepository,
      TourRepository theTourRepository,
      TourService theTourService,
      S3Service theS3Service,
      TourImageMapper theTourImageMapper,
      EntityLookup theEntityLookup) {
    tourImageRepository = theTourImageRepository;
    tourService = theTourService;
    s3Service = theS3Service;
    tourImageMapper = theTourImageMapper;
    entityLookup = theEntityLookup;
  }

  @Override
  public byte[] getTourImageBytes(Integer inputTourId, Integer inputImageId) {
    TourImage tourImage = entityLookup.findTourImageByIdOrThrow(inputImageId);
    byte[] tourImageBytes = s3Service.getObject(imagePath(inputTourId, tourImage.getName()));
    return tourImageBytes;
  }

  @Override
  @Transactional
  public List<TourImageResponseDTO> uploadTourImages(
      Integer inputTourId, List<MultipartFile> inputFiles, String inputCoverImageName) {
    Tour existingTour = entityLookup.findTourByIdWithDetailsOrThrow(inputTourId);
    List<TourImage> images = createTourImages(existingTour, inputFiles, inputCoverImageName);
    List<TourImage> dbImages = tourImageRepository.saveAll(images);
    uploadImagesToS3(inputTourId, inputFiles);

    return tourImageMapper.toDTOList(dbImages);
  }

  @Override
  @Transactional
  public void deleteTourImageById(Integer inputTourId, Integer inputImageId) {
    TourImage tourImageToDelete = entityLookup.findTourImageByIdOrThrow(inputImageId);
    tourImageRepository.deleteById(inputImageId);

    String key = imagePath(inputTourId, tourImageToDelete.getName());
    s3Service.deleteObject(key);
  }

  private List<TourImage> createTourImages(
      Tour existingTour, List<MultipartFile> files, String coverImageName) {
    return files.stream()
        .map(
            file -> {
              String filename = file.getOriginalFilename();
              boolean isCover = filename.equals(coverImageName);
              return new TourImage(filename, isCover, existingTour);
            })
        .collect(Collectors.toList());
  }

  private void uploadImagesToS3(Integer tourId, List<MultipartFile> files) {
    for (MultipartFile file : files) {
      String imageName = file.getOriginalFilename();
      try {
        s3Service.putObject(imagePath(tourId, imageName), file.getBytes());
      } catch (IOException e) {
        throw new S3OperationException("Failed to upload image " + imageName + " to S3", e);
      }
    }
  }
}
