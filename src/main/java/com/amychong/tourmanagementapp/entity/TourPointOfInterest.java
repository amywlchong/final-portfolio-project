package com.amychong.tourmanagementapp.entity;

import jakarta.persistence.*;
import org.apache.commons.lang3.SerializationUtils;

import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name="tour_points_of_interest")
public class TourPointOfInterest implements Identifiable<Integer>, Serializable, DeepCopyable {

    // define fields
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    @JoinColumn(name="tour_id")
    private Tour tour;

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    @JoinColumn(name="point_of_interest_id")
    private PointOfInterest pointOfInterest;

    @Column(name="day")
    private int day;

    // define constructors

    public TourPointOfInterest() {

    }

    public TourPointOfInterest(Tour tour, PointOfInterest pointOfInterest, int day) {
        this.tour = tour;
        this.pointOfInterest = pointOfInterest;
        this.day = day;
    }

    // getters and setters

    @Override
    public Integer getId() {
        return id;
    }

    @Override
    public void setId(Integer id) {
        this.id = id;
    }

    public void setTour(Tour tour) {
        this.tour = tour;
    }

    public PointOfInterest getPointOfInterest() {
        return pointOfInterest;
    }

    public void setPointOfInterest(PointOfInterest pointOfInterest) {
        this.pointOfInterest = pointOfInterest;
    }

    public int getDay() {
        return day;
    }

    public void setDay(int day) {
        this.day = day;
    }

    // deepCopy method
    public TourPointOfInterest deepCopy() {
        return SerializationUtils.clone(this);
    }

    // define toString method

    @Override
    public String toString() {
        return "TourPointOfInterest{" +
                "id=" + id +
                ", pointOfInterest=" + pointOfInterest +
                ", day=" + day +
                '}';
    }

    // define equals and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TourPointOfInterest that = (TourPointOfInterest) o;
        return Objects.equals(tour, that.tour) && Objects.equals(pointOfInterest, that.pointOfInterest);
    }

    @Override
    public int hashCode() {
        return Objects.hash(tour, pointOfInterest);
    }
}

