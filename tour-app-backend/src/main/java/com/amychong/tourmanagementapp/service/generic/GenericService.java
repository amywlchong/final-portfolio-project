package com.amychong.tourmanagementapp.service.generic;

import java.util.List;

public interface GenericService<T, Response> {

  List<Response> findAll();

  Response findByIdOrThrow(Integer theId);

  void deleteById(Integer theId);
}
