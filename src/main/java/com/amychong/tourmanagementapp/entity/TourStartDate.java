package com.amychong.tourmanagementapp.entity;

import jakarta.persistence.*;
import org.apache.commons.lang3.SerializationUtils;

import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name="tour_start_dates")
public class TourStartDate implements Identifiable<TourStartDateKey>, Serializable, DeepCopyable {

    // define fields
    @EmbeddedId
    private TourStartDateKey id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    @MapsId("tourId")  // map to the tourId attribute of embedded id
    @JoinColumn(name="tour_id")
    private Tour tour;

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    @MapsId("startDateId") // map to the startDateId attribute of embedded id
    @JoinColumn(name="start_date_id")
    private StartDate startDate;

    // define constructors
    public TourStartDate() {

    }

    public TourStartDate(Tour tour, StartDate startDate) {
        this.tour = tour;
        this.startDate = startDate;
        this.id = new TourStartDateKey(tour.getId(), startDate.getId());
    }

    // define getters and setters
    @Override
    public TourStartDateKey getId() {
        return id;
    }

    public void setId(TourStartDateKey id) {
        this.id = id;
    }

    public void setTour(Tour tour) {
        this.tour = tour;
    }

    public StartDate getStartDate() {
        return startDate;
    }

    public void setStartDate(StartDate startDate) {
        this.startDate = startDate;
    }

    // deepCopy method
    public TourStartDate deepCopy() {
        return SerializationUtils.clone(this);
    }

    // define toString method

    @Override
    public String toString() {
        return "TourStartDate{" +
                "id=" + id +
                '}';
    }

    // define equals and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TourStartDate that = (TourStartDate) o;
        return Objects.equals(tour, that.tour) && Objects.equals(startDate, that.startDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(tour, startDate);
    }
}
