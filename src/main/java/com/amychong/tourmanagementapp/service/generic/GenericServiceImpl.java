package com.amychong.tourmanagementapp.service.generic;

import com.amychong.tourmanagementapp.entity.interfaces.Identifiable;
import com.amychong.tourmanagementapp.exception.NotFoundException;
import com.amychong.tourmanagementapp.mapper.GenericMapper;
import com.amychong.tourmanagementapp.service.helper.ValidationHelper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public abstract class GenericServiceImpl<T extends Identifiable<Integer>, DTO> implements GenericService<T, DTO> {

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
    public DTO findById(Integer theId) {
        ValidationHelper.validateId(theId);

        T entity = repository.findById(theId).orElseThrow(() -> new NotFoundException("Did not find " + entityClass.getSimpleName() + " id - " + theId));
        if (isSameType()) {
            return (DTO) entity;
        }
        if (mapper != null) {
            return mapper.toDTO(entity);
        }
        return defaultMapToDTO(entity);
    }

    @Transactional
    protected DTO save(T entity) {
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
    @Transactional
    public DTO create(T entity) {
        ValidationHelper.validateNotNull(entity, entityClass.getSimpleName() + " must not be null.");

        // Ensure entity has ID = 0 to always create a new entry
        entity.setId(0);

        return save(entity);
    }

    @Override
    @Transactional
    public void deleteById(Integer theId) {
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

}
