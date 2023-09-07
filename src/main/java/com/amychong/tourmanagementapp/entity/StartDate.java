package com.amychong.tourmanagementapp.entity;

import jakarta.persistence.*;
import org.apache.commons.lang3.SerializationUtils;
import org.hibernate.sql.ast.tree.expression.Star;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name="start_dates")
public class StartDate implements Identifiable<Integer>, Serializable, DeepCopyable {

    // define fields
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Integer id;

    @Column(name="start_date")
    private LocalDateTime startDateTime;

    @OneToMany(mappedBy = "startDate", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<TourStartDate> tourStartDates = new ArrayList<>();

    // define constructors

    public StartDate() {

    }

    public StartDate(LocalDateTime startDateTime) {
        this.startDateTime = startDateTime;
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

    public LocalDateTime getStartDateTime() {
        return startDateTime;
    }

    public void setStartDateTime(LocalDateTime startDateTime) {
        this.startDateTime = startDateTime;
    }

    // deepCopy method
    public StartDate deepCopy() {
        return SerializationUtils.clone(this);
    }

    // define toString method

    @Override
    public String toString() {
        return "StartDate{" +
                "id=" + id +
                ", startDateTime=" + startDateTime +
                '}';
    }

    // define equals and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        StartDate startDate1 = (StartDate) o;
        return Objects.equals(startDateTime, startDate1.startDateTime);
    }

    @Override
    public int hashCode() {
        return Objects.hash(startDateTime);
    }
}
