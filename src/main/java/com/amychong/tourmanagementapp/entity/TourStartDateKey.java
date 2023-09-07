package com.amychong.tourmanagementapp.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;

@Embeddable
public class TourStartDateKey implements Serializable {

    @Column(name = "tour_id")
    private Integer tourId;

    @Column(name = "start_date_id")
    private Integer startDateId;

    // Constructors
    public TourStartDateKey() {

    }

    public TourStartDateKey(int tourId, int startDateId) {
        this.tourId = tourId;
        this.startDateId = startDateId;
    }

    // getters and setters
    public Integer getTourId() {
        return tourId;
    }

    public void setTourId(Integer tourId) {
        this.tourId = tourId;
    }

    public Integer getStartDateId() {
        return startDateId;
    }

    public void setStartDateId(Integer startDateId) {
        this.startDateId = startDateId;
    }

    // equals and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        TourStartDateKey that = (TourStartDateKey) o;

        if (tourId != that.tourId) return false;
        return startDateId == that.startDateId;
    }

    @Override
    public int hashCode() {
        int result = Integer.hashCode(tourId);
        result = 31 * result + Integer.hashCode(startDateId);
        return result;
    }

    // toString method

    @Override
    public String toString() {
        return "TourStartDateKey{" +
                "tourId=" + tourId +
                ", startDateId=" + startDateId +
                '}';
    }
}
