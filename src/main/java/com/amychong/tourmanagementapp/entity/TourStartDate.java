package com.amychong.tourmanagementapp.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import org.apache.commons.lang3.SerializationUtils;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name="tour_start_dates")
public class TourStartDate implements Identifiable<TourStartDateKey>, Serializable, DeepCopyable {

    // define fields
    @EmbeddedId
    private TourStartDateKey id;

    @Transient
    private Integer availableSpaces;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    @MapsId("tourId")  // map to the tourId attribute of embedded id
    @JoinColumn(name="tour_id")
    private Tour tour;

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    @MapsId("startDateId") // map to the startDateId attribute of embedded id
    @JoinColumn(name="start_date_id")
    private StartDate startDate;

    @OneToMany(mappedBy = "tourStartDate", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<TourGuideSchedule> tourGuideSchedules = new ArrayList<>();

    @OneToMany(mappedBy = "tourStartDate", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Booking> bookings = new ArrayList<>();

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

    public Integer getAvailableSpaces() {
        return availableSpaces;
    }

    public void setAvailableSpaces(Integer availableSpaces) {
        this.availableSpaces = availableSpaces;
    }

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    public Tour getTour() {
        return tour;
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

    public List<TourGuideSchedule> getTourGuideSchedules() {
        return tourGuideSchedules;
    }

    public void setTourGuideSchedules(List<TourGuideSchedule> tourGuideSchedules) {
        this.tourGuideSchedules = tourGuideSchedules;
    }

    public void addTourGuideSchedule(TourGuideSchedule tourGuideSchedule) {
        tourGuideSchedules.add(tourGuideSchedule);
        tourGuideSchedule.setTourStartDate(this);
    }

    public void removeTourGuideSchedule(TourGuideSchedule tourGuideSchedule) {
        tourGuideSchedules.remove(tourGuideSchedule);
        tourGuideSchedule.setTourStartDate(null);
    }

    public List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings;
    }

    public void addBooking(Booking booking) {
        bookings.add(booking);
        booking.setTourStartDate(this);
    }

    public void removeBooking(Booking booking) {
        bookings.remove(booking);
        booking.setTourStartDate(null);
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
                ", availableSpaces=" + availableSpaces +
                ", tour=" + tour +
                ", startDate=" + startDate +
                ", tourGuideSchedules=" + tourGuideSchedules +
                ", bookings=" + bookings +
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
