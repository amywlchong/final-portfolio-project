package com.amychong.tourmanagementapp.dto.review;

import com.amychong.tourmanagementapp.entity.user.Role;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ReviewResponseDTO {

    private Integer id;

    private String review;

    private Integer rating;

    private LocalDate createdDate = LocalDate.now();

    // Booking field
    private Integer bookingId;

    // User fields
    private Integer userId;
    private String userName;
    private Boolean userActive;
    private Role userRole;

    // Tour fields
    private Integer tourId;
    private String tourName;
    private int tourDuration;
    private String tourRegion;

    // StartDate fields
    private Integer startDateId;
    private LocalDateTime startDateTime;

    // constructors
    public ReviewResponseDTO() {
    }

    public ReviewResponseDTO(Integer id, String review, Integer rating, LocalDate createdDate, Integer bookingId, Integer userId, String userName, Boolean userActive, Role userRole, Integer tourId, String tourName, int tourDuration, String tourRegion, Integer startDateId, LocalDateTime startDateTime) {
        this.id = id;
        this.review = review;
        this.rating = rating;
        this.createdDate = createdDate;
        this.bookingId = bookingId;
        this.userId = userId;
        this.userName = userName;
        this.userActive = userActive;
        this.userRole = userRole;
        this.tourId = tourId;
        this.tourName = tourName;
        this.tourDuration = tourDuration;
        this.tourRegion = tourRegion;
        this.startDateId = startDateId;
        this.startDateTime = startDateTime;
    }

    // Getters, setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getReview() {
        return review;
    }

    public void setReview(String review) {
        this.review = review;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public LocalDate getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }

    public Integer getBookingId() {
        return bookingId;
    }

    public void setBookingId(Integer bookingId) {
        this.bookingId = bookingId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Boolean getUserActive() {
        return userActive;
    }

    public void setUserActive(Boolean userActive) {
        this.userActive = userActive;
    }

    public Role getUserRole() {
        return userRole;
    }

    public void setUserRole(Role userRole) {
        this.userRole = userRole;
    }

    public Integer getTourId() {
        return tourId;
    }

    public void setTourId(Integer tourId) {
        this.tourId = tourId;
    }

    public String getTourName() {
        return tourName;
    }

    public void setTourName(String tourName) {
        this.tourName = tourName;
    }

    public int getTourDuration() {
        return tourDuration;
    }

    public void setTourDuration(int tourDuration) {
        this.tourDuration = tourDuration;
    }

    public String getTourRegion() {
        return tourRegion;
    }

    public void setTourRegion(String tourRegion) {
        this.tourRegion = tourRegion;
    }

    public Integer getStartDateId() {
        return startDateId;
    }

    public void setStartDateId(Integer startDateId) {
        this.startDateId = startDateId;
    }

    public LocalDateTime getStartDateTime() {
        return startDateTime;
    }

    public void setStartDateTime(LocalDateTime startDateTime) {
        this.startDateTime = startDateTime;
    }

    // toString method
    @Override
    public String toString() {
        return "ReviewDTO{" +
                "id=" + id +
                ", review='" + review + '\'' +
                ", rating=" + rating +
                ", createdDate=" + createdDate +
                ", bookingId=" + bookingId +
                ", userId=" + userId +
                ", userName='" + userName + '\'' +
                ", userActive=" + userActive +
                ", userRole='" + userRole + '\'' +
                ", tourId=" + tourId +
                ", tourName='" + tourName + '\'' +
                ", tourDuration=" + tourDuration +
                ", tourRegion='" + tourRegion + '\'' +
                ", startDateId=" + startDateId +
                ", startDateTime=" + startDateTime +
                '}';
    }
}
