package com.amychong.tourmanagementapp.service.tour;

import com.amychong.tourmanagementapp.entity.interfaces.Identifiable;
import com.amychong.tourmanagementapp.entity.tour.Tour;
import com.amychong.tourmanagementapp.entity.tour.TourStartDate;
import com.amychong.tourmanagementapp.entity.tour.TourStartDateKey;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.function.BiConsumer;
import java.util.function.BiFunction;
import java.util.function.Function;
import java.util.stream.Collectors;

// T = type of tour-related entities
// U = type of associated entities
// V = type of unique field of associated entities
public class TourUpdateProcessor<T extends Identifiable, U extends Identifiable, V> {

  // Tour
  protected Integer inputTourId;

  protected Function<Integer, Tour> findTourFunction;

  // Tour-related entities (incl. TourImage, TourPointOfInterest, TourStartDate)
  protected List<T> inputTourRelatedEntities;

  protected BiFunction<Integer, V, Optional<T>> findTourRelatedEntityFromDB;

  protected Function<Tour, List<T>> getEntitiesFromTourFunction;

  protected BiConsumer<Tour, T> addEntityToTourFunction;

  // Associated entities (incl. TourImage, PointOfInterest, StartDate)
  protected Function<T, U> getAssociatedEntityFunction;

  protected Function<U, V> getUniqueFieldOfAssociatedEntityFunction;

  protected Function<List<V>, List<U>> findExistingAssociatedEntitiesFunction;

  // prepare tour and entities for update
  protected Tour processTourForUpdate() {
    Tour existingTour = findTourFunction.apply(inputTourId);
    Tour copyOfExistingTour = existingTour.deepCopy();

    List<T> entitiesOfExistingTour = getEntitiesFromTourFunction.apply(copyOfExistingTour);
    entitiesOfExistingTour.clear();

    List<U> existingAssociatedEntities = findExistingAssociatedEntitiesFromUniqueField();

    for (T inputEntity : inputTourRelatedEntities) {
      U inputAssociatedEntity = getAssociatedEntityFunction.apply(inputEntity);
      V valueOfUniqueField = getUniqueFieldOfAssociatedEntityFunction.apply(inputAssociatedEntity);
      Optional<T> dbTourRelatedEntity =
          findTourRelatedEntityFromDB.apply(inputTourId, valueOfUniqueField);

      TourUpdateProcessor.setIdsOfInputEntityAndAssociatedEntity(
          dbTourRelatedEntity,
          inputEntity,
          getAssociatedEntityFunction,
          existingAssociatedEntities);

      addEntityToTourFunction.accept(copyOfExistingTour, inputEntity);
    }
    return copyOfExistingTour;
  }

  protected List<U> findExistingAssociatedEntitiesFromUniqueField() {

    List<V> uniqueFields =
        inputTourRelatedEntities.stream()
            .map(getAssociatedEntityFunction)
            .filter(Objects::nonNull)
            .map(getUniqueFieldOfAssociatedEntityFunction)
            .collect(Collectors.toList());

    return findExistingAssociatedEntitiesFunction.apply(uniqueFields);
  }

  protected static <T, U, V> List<U> findExistingAssociatedEntitiesFromUniqueField(
      List<T> inputTourRelatedEntities,
      Function<T, U> getAssociatedEntityFunction,
      Function<U, V> getUniqueFieldFunction,
      Function<List<V>, List<U>> findExistingAssociatedEntitiesFunction) {

    List<V> uniqueFields =
        inputTourRelatedEntities.stream()
            .map(getAssociatedEntityFunction)
            .filter(Objects::nonNull)
            .map(getUniqueFieldFunction)
            .collect(Collectors.toList());

    return findExistingAssociatedEntitiesFunction.apply(uniqueFields);
  }

  protected static <T extends Identifiable, U extends Identifiable>
      void setIdsOfInputEntityAndAssociatedEntity(
          Optional<T> dbEntity,
          T inputEntity,
          Function<T, U> getAssociatedEntityFunction,
          List<U> existingAssociatedEntities) {

    U inputAssociatedEntity = getAssociatedEntityFunction.apply(inputEntity);

    if (dbEntity.isPresent()) {
      inputEntity.setId(dbEntity.get().getId());
      inputAssociatedEntity.setId(getAssociatedEntityFunction.apply(dbEntity.get()).getId());
    } else {
      TourUpdateProcessor.resetId(inputEntity);
      TourUpdateProcessor.setEntityId(inputAssociatedEntity, existingAssociatedEntities);
    }
  }

  protected static <T extends Identifiable> void resetId(T inputEntity) {
    if (inputEntity instanceof TourStartDate) {
      inputEntity.setId(new TourStartDateKey(0, 0));
    } else {
      inputEntity.setId(0);
    }
  }

  protected static <T extends Identifiable> void setEntityId(
      T inputEntity, List<T> existingEntities) {

    if (inputEntity == null) {
      return;
    }

    if (existingEntities != null && existingEntities.contains(inputEntity)) {
      int index = existingEntities.indexOf(inputEntity);
      inputEntity.setId(existingEntities.get(index).getId());
    } else {
      TourUpdateProcessor.resetId(inputEntity);
    }
  }
}
