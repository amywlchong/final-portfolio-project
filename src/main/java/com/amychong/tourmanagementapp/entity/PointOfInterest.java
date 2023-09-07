package com.amychong.tourmanagementapp.entity;

import jakarta.persistence.*;
import org.apache.commons.lang3.SerializationUtils;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name="points_of_interest")
public class PointOfInterest implements Identifiable<Integer>, Serializable, DeepCopyable {

    // define fields
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Integer id;

    @Column(name="name")
    private String name;

    @Column(name="description")
    private String description;

    @OneToMany(mappedBy = "pointOfInterest", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<TourPointOfInterest> tourPointsOfInterest = new ArrayList<>();

    // define constructors

    public PointOfInterest() {

    }

    public PointOfInterest(String name, String description) {
        this.name = name;
        this.description = description;
    }

    // define getters and setters

    @Override
    public Integer getId() {
        return id;
    }

    @Override
    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    // deepCopy method
    public PointOfInterest deepCopy() {
        return SerializationUtils.clone(this);
    }

    // define toString method

    @Override
    public String toString() {
        return "PointOfInterest{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                '}';
    }

    // define equals and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PointOfInterest that = (PointOfInterest) o;
        return Objects.equals(name, that.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name);
    }
}
