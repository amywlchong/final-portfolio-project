package com.amychong.tourmanagementapp.service.generic;

import com.amychong.tourmanagementapp.entity.interfaces.Identifiable;
import com.amychong.tourmanagementapp.exception.NotFoundException;
import com.amychong.tourmanagementapp.mapper.GenericMapper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public abstract class GenericServiceImpl<T extends Identifiable<Integer>, Response>
    implements GenericService<T, Response> {

  private final JpaRepository<T, Integer> repository;
  private final Class<T> entityClass;
  private final Class<Response> dtoClass;
  private final GenericMapper<T, Response> mapper;

  public GenericServiceImpl(
      JpaRepository<T, Integer> repository, Class<T> entityClass, Class<Response> dtoClass) {
    this(repository, entityClass, dtoClass, null);
  }

  public GenericServiceImpl(
      JpaRepository<T, Integer> repository,
      Class<T> entityClass,
      Class<Response> dtoClass,
      GenericMapper<T, Response> mapper) {
    this.repository = repository;
    this.entityClass = entityClass;
    this.dtoClass = dtoClass;
    this.mapper = mapper;
  }

  @Override
  public List<Response> findAll() {
    List<T> entities = repository.findAll();
    if (isSameType()) {
      return (List<Response>) entities;
    }
    if (mapper != null) {
      return mapper.toDTOList(entities);
    }
    return defaultMapToDTOList(entities);
  }

  @Override
  public Response findByIdOrThrow(Integer theId) {
    T entity =
        repository
            .findById(theId)
            .orElseThrow(
                () ->
                    new NotFoundException(
                        "Did not find " + entityClass.getSimpleName() + " id - " + theId));
    if (isSameType()) {
      return (Response) entity;
    }
    if (mapper != null) {
      return mapper.toDTO(entity);
    }
    return defaultMapToDTO(entity);
  }

  @Transactional
  protected Response save(T entity) {
    T savedEntity = repository.save(entity);
    if (isSameType()) {
      return (Response) savedEntity;
    }
    if (mapper != null) {
      return mapper.toDTO(savedEntity);
    }
    return defaultMapToDTO(savedEntity);
  }

  @Transactional
  protected Response create(T entity) {
    // Ensure entity has ID = 0 to always create a new entry
    entity.setId(0);

    return save(entity);
  }

  @Override
  @Transactional
  public void deleteById(Integer theId) {
    // find by id or else throw an exception
    findByIdOrThrow(theId);

    // delete by id
    repository.deleteById(theId);
  }

  private boolean isSameType() {
    return entityClass.equals(dtoClass);
  }

  // Default mapping methods; can be overridden by specific services
  protected Response defaultMapToDTO(T entity) {
    throw new UnsupportedOperationException(
        "Mapping to DTO not supported without a defined mapper.");
  }

  protected List<Response> defaultMapToDTOList(List<T> entities) {
    throw new UnsupportedOperationException(
        "Mapping list to DTO list not supported without a defined mapper.");
  }
}
