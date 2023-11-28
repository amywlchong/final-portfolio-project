package com.amychong.tourmanagementapp.mapper;

import com.amychong.tourmanagementapp.dto.tour.TourResponseDTO;
import com.amychong.tourmanagementapp.entity.tour.Tour;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = TourImageMapper.class)
public interface TourMapper extends GenericMapper<Tour, TourResponseDTO> {}
