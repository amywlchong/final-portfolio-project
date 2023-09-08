package com.amychong.tourmanagementapp.service;

import com.amychong.tourmanagementapp.entity.*;
import com.amychong.tourmanagementapp.exception.NotFoundException;
import org.apache.commons.lang3.tuple.Pair;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.function.BiConsumer;
import java.util.function.Function;
import java.util.stream.Collectors;

// T = type of tour-related entities
// U = type of associated entities
// V = type of unique field of associated entities
public class TourUpdateHelper<T extends Identifiable, U extends Identifiable, V> {

    // Tour
    protected Integer inputTourId;

    protected Function<Integer, Optional<Tour>> fetchTourFunction;

    // Tour-related entities (incl. TourImage, TourPointOfInterest, TourStartDate)
    protected List<T> inputTourRelatedEntities;

    protected Function<List<T>, List<T>> deepCopyFunction;

    protected Function<Tour, List<T>> getEntitiesFromTourFunction;

    protected BiConsumer<Tour, T> addEntityToTourFunction;

    // Associated entities (incl. TourImage, PointOfInterest, StartDate)
    protected Function<T, U> getAssociatedEntityFunction;

    protected Function<U, V> getUniqueFieldOfAssociatedEntityFunction;

    protected Function<List<V>, List<U>> findExistingAssociatedEntitiesFunction;

    // Set id of the associated entity
    // (Pass a tour-related entity to the function to set the id of its associated entity)
    protected BiConsumer<T, List<U>> setIdOfAssociatedEntityFunction;

    // pre-update processing
    protected Pair<Tour, Tour> processTourForUpdate() {
        Optional<Tour> optionalExistingTour = fetchTourFunction.apply(inputTourId);
        if (!optionalExistingTour.isPresent()) {
            throw new NotFoundException("Tour not found.");
        }
        Tour existingTour = optionalExistingTour.get();
        Tour copyOfExistingTour = existingTour.deepCopy();
        List<T> copiedInputEntities = deepCopyFunction.apply(inputTourRelatedEntities);

        List<T> entitiesOfExistingTour = getEntitiesFromTourFunction.apply(copyOfExistingTour);
        List<T> copiedEntitiesOfExistingTour = new ArrayList<>(entitiesOfExistingTour);
        entitiesOfExistingTour.clear();

        List<U> existingAssociatedEntities = findExistingAssociatedEntitiesFromUniqueField();

        for (T inputEntity : copiedInputEntities) {
            addEntityToTourFunction.accept(copyOfExistingTour, inputEntity);
            setIdOfAssociatedEntityFunction.accept(inputEntity, existingAssociatedEntities);
            TourUpdateHelper.setEntityId(inputEntity, copiedEntitiesOfExistingTour);
        }
        return Pair.of(existingTour, copyOfExistingTour);
    }

    protected List<U> findExistingAssociatedEntitiesFromUniqueField() {

        List<V> uniqueFields = inputTourRelatedEntities.stream()
                .map(getAssociatedEntityFunction)
                .filter(Objects::nonNull)
                .map(getUniqueFieldOfAssociatedEntityFunction)
                .collect(Collectors.toList());

        return findExistingAssociatedEntitiesFunction.apply(uniqueFields);
    }

    protected static <A, B, C> List<B> findExistingAssociatedEntitiesFromUniqueField(
            List<A> inputTourRelatedEntities,
            Function<A, B> getAssociatedEntityFunction,
            Function<B, C> getUniqueFieldFunction,
            Function<List<C>, List<B>> findExistingAssociatedEntitiesFunction) {

        List<C> uniqueFields = inputTourRelatedEntities.stream()
                .map(getAssociatedEntityFunction)
                .filter(Objects::nonNull)
                .map(getUniqueFieldFunction)
                .collect(Collectors.toList());

        return findExistingAssociatedEntitiesFunction.apply(uniqueFields);
    }

    protected static <T extends Identifiable> void setEntityId(T inputEntity, List<T> existingEntities) {

        if (inputEntity == null) {
            return;
        }

        if (existingEntities != null && existingEntities.contains(inputEntity)) {
            int index = existingEntities.indexOf(inputEntity);
            inputEntity.setId(existingEntities.get(index).getId());
        } else {
            if (inputEntity instanceof TourStartDate) {
                inputEntity.setId(new TourStartDateKey(0, 0));
            } else {
                inputEntity.setId(0);
            }
        }
    }
}
