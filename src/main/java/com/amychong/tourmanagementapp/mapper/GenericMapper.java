package com.amychong.tourmanagementapp.mapper;

import java.util.List;

public interface GenericMapper<T, DTO> {

    DTO toDTO(T entity);

    List<DTO> toDTOList(List<T> entities);

}