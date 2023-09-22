package com.amychong.tourmanagementapp.mapper;

import java.util.List;

public interface GenericMapper<T, ResponseDTO> {

    ResponseDTO toDTO(T entity);

    List<ResponseDTO> toDTOList(List<T> entities);

}