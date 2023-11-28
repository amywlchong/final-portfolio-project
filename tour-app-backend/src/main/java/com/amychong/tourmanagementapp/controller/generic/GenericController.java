package com.amychong.tourmanagementapp.controller.generic;

import com.amychong.tourmanagementapp.service.generic.GenericService;
import jakarta.validation.constraints.Min;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

public abstract class GenericController<T, Response> {

  private final GenericService<T, Response> service;

  public GenericController(GenericService<T, Response> service) {
    this.service = service;
  }

  @GetMapping
  public ResponseEntity<List<Response>> getAll() {
    return new ResponseEntity<>(service.findAll(), HttpStatus.OK);
  }

  @GetMapping("/{id}")
  public ResponseEntity<Response> getById(@Min(1) @PathVariable Integer id) {
    Response response = service.findByIdOrThrow(id);
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<String> delete(@Min(1) @PathVariable Integer id) {
    service.deleteById(id);
    return new ResponseEntity<>("Deleted entity id - " + id, HttpStatus.OK);
  }
}
