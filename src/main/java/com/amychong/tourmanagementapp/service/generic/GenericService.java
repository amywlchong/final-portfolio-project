package com.amychong.tourmanagementapp.service.generic;

import com.amychong.tourmanagementapp.entity.user.UserDetails;

import java.util.List;

public interface GenericService<T, DTO> {

    List<DTO> findAll();

    DTO findById(Integer theId);

    DTO create(T entity);

    void deleteById(Integer theId);
}

