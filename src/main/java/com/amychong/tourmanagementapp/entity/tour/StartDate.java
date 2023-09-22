package com.amychong.tourmanagementapp.entity.tour;

import com.amychong.tourmanagementapp.entity.interfaces.DeepCopyable;
import com.amychong.tourmanagementapp.entity.interfaces.Identifiable;
import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import org.apache.commons.lang3.SerializationUtils;

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

    @NotNull(message = "Start date time is required")
    @Future(message = "Start date time must be in the future")
    @Column(name="start_date_time")
    private final LocalDateTime startDateTime;

    @OneToMany(mappedBy = "startDate", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<TourStartDate> tourStartDates = new ArrayList<>();

    // define constructors

    public StartDate() {
        this.startDateTime = LocalDateTime.of(9999, 12, 31, 23, 59);
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
