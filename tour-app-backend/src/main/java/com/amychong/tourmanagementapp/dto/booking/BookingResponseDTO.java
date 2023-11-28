package com.amychong.tourmanagementapp.dto.booking;

import com.amychong.tourmanagementapp.entity.user.Role;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class BookingResponseDTO {

  private Integer id;

  private BigDecimal unitPrice;

  private BigDecimal totalPrice;

  private boolean paid;

  private String transactionId;

  private int numberOfParticipants;

  private LocalDate createdDate;

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
  public BookingResponseDTO() {}

  public BookingResponseDTO(
      Integer id,
      BigDecimal unitPrice,
      BigDecimal totalPrice,
      boolean paid,
      String transactionId,
      int numberOfParticipants,
      LocalDate createdDate,
      Integer userId,
      String userName,
      Boolean userActive,
      Role userRole,
      Integer tourId,
      String tourName,
      int tourDuration,
      String tourRegion,
      Integer startDateId,
      LocalDateTime startDateTime) {
    this.id = id;
    this.unitPrice = unitPrice;
    this.totalPrice = totalPrice;
    this.paid = paid;
    this.transactionId = transactionId;
    this.numberOfParticipants = numberOfParticipants;
    this.createdDate = createdDate;
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

  public String getTransactionId() {
    return transactionId;
  }

  public void setTransactionId(String transactionId) {
    this.transactionId = transactionId;
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
    return "BookingDTO{"
        + "id="
        + id
        + ", unitPrice="
        + unitPrice
        + ", totalPrice="
        + totalPrice
        + ", paid="
        + paid
        + ", transactionId='"
        + transactionId
        + '\''
        + ", numberOfParticipants="
        + numberOfParticipants
        + ", createdDate="
        + createdDate
        + ", userId="
        + userId
        + ", userName='"
        + userName
        + '\''
        + ", userActive="
        + userActive
        + ", userRole='"
        + userRole
        + '\''
        + ", tourId="
        + tourId
        + ", tourName='"
        + tourName
        + '\''
        + ", tourDuration="
        + tourDuration
        + ", tourRegion='"
        + tourRegion
        + '\''
        + ", startDateId="
        + startDateId
        + ", startDateTime="
        + startDateTime
        + '}';
  }
}
