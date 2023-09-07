package com.amychong.tourmanagementapp.entity;

import jakarta.persistence.*;
import org.apache.commons.lang3.SerializationUtils;

import java.io.Serializable;

@Entity
@Table(name="tour_guide_schedules")
public class TourGuideSchedule implements Identifiable<Integer>, Serializable, DeepCopyable {

    // define fields
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="tour_id")
    private Tour tour;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="tour_start_date_id")
    private StartDate startDate;

    // define constructors
    public TourGuideSchedule() {

    }

    public TourGuideSchedule(User user, Tour tour, StartDate startDate) {
        this.user = user;
        this.tour = tour;
        this.startDate = startDate;
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

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

    // deepCopy method
    public TourGuideSchedule deepCopy() {
        return SerializationUtils.clone(this);
    }

    // define toString method

    @Override
    public String toString() {
        return "TourGuideSchedule{" +
                "id=" + id +
                ", user=" + user +
                ", tour=" + tour +
                ", startDate=" + startDate +
                '}';
    }
}
