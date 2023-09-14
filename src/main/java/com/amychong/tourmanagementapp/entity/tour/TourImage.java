package com.amychong.tourmanagementapp.entity.tour;

import com.amychong.tourmanagementapp.entity.interfaces.DeepCopyable;
import com.amychong.tourmanagementapp.entity.interfaces.Identifiable;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.apache.commons.lang3.SerializationUtils;

import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name="tour_images")
public class TourImage implements Identifiable<Integer>, Serializable, DeepCopyable {

    // define fields
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Integer id;

    @Column(name="name")
    private String name;

    @Column(name="is_cover")
    private boolean isCover = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="tour_id")
    private Tour tour;

    // define constructors
    public TourImage() {

    }

    public TourImage(String name, boolean isCover, Tour tour) {
        this.name = name;
        this.isCover = isCover;
        this.tour = tour;
    }

    // define getters and setters
    @JsonIgnore
    public TourImage getThis() { return this; }

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

    public boolean isCover() {
        return isCover;
    }

    public void setCover(boolean cover) {
        isCover = cover;
    }

    public void setTour(Tour tour) {
        this.tour = tour;
    }

    // deepCopy method
    public TourImage deepCopy() {
        return SerializationUtils.clone(this);
    }

    // define toString method

    @Override
    public String toString() {
        return "TourImage{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", isCover=" + isCover +
                '}';
    }
}
