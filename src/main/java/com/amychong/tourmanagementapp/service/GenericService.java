package com.amychong.tourmanagementapp.service;

import java.util.List;

public interface GenericService<T, DTO> {

    List<DTO> findAll();

    DTO findById(int theId);

    DTO create(T entity);

    void deleteById(int theId);
}

