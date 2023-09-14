package com.amychong.tourmanagementapp.entity.schedule;

import com.amychong.tourmanagementapp.entity.interfaces.DeepCopyable;
import com.amychong.tourmanagementapp.entity.interfaces.HasTourStartDate;
import com.amychong.tourmanagementapp.entity.interfaces.HasUser;
import com.amychong.tourmanagementapp.entity.interfaces.Identifiable;
import com.amychong.tourmanagementapp.entity.tour.TourStartDate;
import com.amychong.tourmanagementapp.entity.user.User;
import jakarta.persistence.*;
import org.apache.commons.lang3.SerializationUtils;

import java.io.Serializable;

@Entity
@Table(name="tour_guide_schedules")
public class TourGuideSchedule implements Identifiable<Integer>, Serializable, DeepCopyable, HasUser, HasTourStartDate {

    // define fields
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name="tour_start_date_id"),
            @JoinColumn(name="tour_id")
    })
    private TourStartDate tourStartDate;

    // define constructors
    public TourGuideSchedule() {

    }

    public TourGuideSchedule(User user, TourStartDate tourStartDate) {
        this.user = user;
        this.tourStartDate = tourStartDate;
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

    public TourStartDate getTourStartDate() {
        return tourStartDate;
    }

    public void setTourStartDate(TourStartDate tourStartDate) {
        this.tourStartDate = tourStartDate;
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
                ", tourStartDate=" + tourStartDate +
                '}';
    }
}
