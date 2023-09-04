package com.amychong.tourmanagementapp.service;

import com.amychong.tourmanagementapp.exception.NotFoundException;
import com.amychong.tourmanagementapp.mapper.GenericMapper;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public abstract class GenericServiceImpl<T, DTO> implements GenericService<T, DTO> {

    private JpaRepository<T, Integer> repository;
    protected GenericMapper<T, DTO> mapper;

    private Class<T> entityClass;
    private Class<DTO> dtoClass;

    public GenericServiceImpl(JpaRepository<T, Integer> repository, Class<T> entityClass, Class<DTO> dtoClass) {
        this.repository = repository;
        this.entityClass = entityClass;
        this.dtoClass = dtoClass;
    }

    public GenericServiceImpl(JpaRepository<T, Integer> repository, GenericMapper<T, DTO> mapper, Class<T> entityClass, Class<DTO> dtoClass) {
        this(repository, entityClass, dtoClass);
        this.mapper = mapper;
    }

    @Override
    public List<DTO> findAll() {
        List<T> entities = repository.findAll();
        if (isSameType()) {
            return (List<DTO>) entities;
        }
        if (mapper != null) {
            return mapper.toDTOList(entities);
        }
        return defaultMapToDTOList(entities);
    }

    @Override
    public DTO findById(int theId) {
        validateId(theId);

        T entity = repository.findById(theId).orElseThrow(() -> new NotFoundException("Did not find " + entityClass.getSimpleName() + " id - " + theId));
        if (isSameType()) {
            return (DTO) entity;
        }
        if (mapper != null) {
            return mapper.toDTO(entity);
        }
        return defaultMapToDTO(entity);
    }

    @Override
    public DTO save(T entity) {
        validateNotNull(entity, entityClass.getSimpleName() + " must not be null.");

        T savedEntity = repository.save(entity);
        if (isSameType()) {
            return (DTO) savedEntity;
        }
        if (mapper != null) {
            return mapper.toDTO(savedEntity);
        }
        return defaultMapToDTO(savedEntity);
    }

    @Override
    public void deleteById(int theId) {
        // find by id or else throw an exception
        findById(theId);

        // delete by id
        repository.deleteById(theId);
    }

    private boolean isSameType() {
        return entityClass.equals(dtoClass);
    }

    // Default mapping methods; can be overridden by specific services
    protected DTO defaultMapToDTO(T entity) {
        throw new UnsupportedOperationException("Mapping to DTO not supported without a defined mapper.");
    }

    protected List<DTO> defaultMapToDTOList(List<T> entities) {
        throw new UnsupportedOperationException("Mapping list to DTO list not supported without a defined mapper.");
    }

    protected void validateId(int theId) {
        if (theId <= 0) {
            throw new IllegalArgumentException("ID must be a positive number.");
        }
    }

    protected void validateNotNull(Object obj, String message) {
        if (obj == null) {
            throw new IllegalArgumentException(message);
        }
    }

    protected void validateNotEmpty(String str, String message) {
        if (str == null || str.isEmpty()) {
            throw new IllegalArgumentException(message);
        }
    }

}
