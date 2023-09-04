package com.amychong.tourmanagementapp.controller;

import com.amychong.tourmanagementapp.entity.Identifiable;
import com.amychong.tourmanagementapp.service.GenericService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

public abstract class GenericRestController<T extends Identifiable, DTO> {

    protected GenericService<T, DTO> service;

    public GenericRestController(GenericService<T, DTO> service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<DTO>> getAll() {
        return new ResponseEntity<>(service.findAll(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DTO> getById(@PathVariable int id) {
        DTO dto = service.findById(id);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<DTO> add(@RequestBody T entity) {
        // just in case they pass an id in JSON
        // set id to 0
        // to force a save of new item instead of update

        entity.setId(0);
        DTO dbDto = service.save(entity);
        return new ResponseEntity<>(dbDto, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable int id) {
        service.deleteById(id);
        return new ResponseEntity<>("Deleted entity id - " + id, HttpStatus.OK);
    }

}
