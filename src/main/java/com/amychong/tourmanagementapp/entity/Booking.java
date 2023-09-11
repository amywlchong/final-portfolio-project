package com.amychong.tourmanagementapp.entity;

import jakarta.persistence.*;
import org.apache.commons.lang3.SerializationUtils;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;

@Entity
@Table(name="bookings")
public class Booking implements Identifiable<Integer>, Serializable, DeepCopyable, HasUser, HasTourStartDate {

    // define fields
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Integer id;

    @Column(name="unit_price", precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(name="total_price", precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @Column(name="paid")
    private boolean paid = false;

    @Column(name="number_of_participants")
    private int numberOfParticipants;

    @Column(name="created_date")
    private LocalDate createdDate = LocalDate.now();

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
    public Booking() {

    }

    public Booking(BigDecimal unitPrice, BigDecimal totalPrice, boolean paid, int numberOfParticipants, LocalDate createdDate, User user, TourStartDate tourStartDate) {
        this.unitPrice = unitPrice;
        this.totalPrice = totalPrice;
        this.paid = paid;
        this.numberOfParticipants = numberOfParticipants;
        this.createdDate = createdDate;
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

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public boolean isPaid() {
        return paid;
    }

    public void setPaid(boolean paid) {
        this.paid = paid;
    }

    public int getNumberOfParticipants() {
        return numberOfParticipants;
    }

    public void setNumberOfParticipants(int numberOfParticipants) {
        this.numberOfParticipants = numberOfParticipants;
    }

    public LocalDate getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }

    @Override
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public TourStartDate getTourStartDate() {
        return tourStartDate;
    }

    public void setTourStartDate(TourStartDate tourStartDate) {
        this.tourStartDate = tourStartDate;
    }

    // deepCopy method
    public Booking deepCopy() {
        return SerializationUtils.clone(this);
    }

    // define toString method
    @Override
    public String toString() {
        return "Booking{" +
                "id=" + id +
                ", unitPrice=" + unitPrice +
                ", totalPrice=" + totalPrice +
                ", paid=" + paid +
                ", numberOfParticipants=" + numberOfParticipants +
                ", createdDate=" + createdDate +
                ", user=" + user +
                ", tourStartDate=" + tourStartDate +
                '}';
    }
}
