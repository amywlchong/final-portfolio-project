package com.amychong.tourmanagementapp.mapper;

import com.amychong.tourmanagementapp.dto.tour.TourImageResponseDTO;
import com.amychong.tourmanagementapp.entity.tour.TourImage;
import org.mapstruct.Mapper;

import java.util.List;

import static com.amychong.tourmanagementapp.service.S3.S3PathHelper.imagePath;

@Mapper(componentModel = "spring")
public interface TourImageMapper extends GenericMapper<TourImage, TourImageResponseDTO> {

  @Override
  default TourImageResponseDTO toDTO(TourImage tourImage) {

    TourImageResponseDTO dto = new TourImageResponseDTO();
    dto.setImageId(tourImage.getId());
    dto.setImageName(tourImage.getName());
    dto.setImagePath(imagePath(tourImage.getTour().getId(), tourImage.getName()));
    dto.setCoverImage(tourImage.isCover());

    return dto;
  }

  @Override
  List<TourImageResponseDTO> toDTOList(List<TourImage> tourImages);
}
