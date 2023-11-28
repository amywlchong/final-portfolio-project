package com.amychong.tourmanagementapp.entity.review;

import com.amychong.tourmanagementapp.entity.interfaces.DeepCopyable;
import com.amychong.tourmanagementapp.entity.interfaces.Identifiable;
import com.amychong.tourmanagementapp.entity.booking.Booking;
import jakarta.persistence.*;
import org.apache.commons.lang3.SerializationUtils;

import java.io.Serializable;
import java.time.LocalDate;

@Entity
@Table(name = "reviews")
public class Review implements Identifiable<Integer>, Serializable, DeepCopyable {

  // define fields
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Integer id;

  @Column(name = "review")
  private String review;

  @Column(name = "rating")
  private Integer rating;

  @Column(name = "created_date")
  private LocalDate createdDate = LocalDate.now();

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "booking_id")
  private Booking booking;

  // define constructors
  public Review() {}

  public Review(String review, Integer rating, LocalDate createdDate, Booking booking) {
    this.review = review;
    this.rating = rating;
    this.createdDate = createdDate;
    this.booking = booking;
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

  public Booking getBooking() {
    return booking;
  }

  public void setBooking(Booking booking) {
    this.booking = booking;
  }

  // deepCopy method
  public Review deepCopy() {
    return SerializationUtils.clone(this);
  }

  // define toString method
  @Override
  public String toString() {
    return "Review{"
        + "id="
        + id
        + ", review='"
        + review
        + '\''
        + ", rating="
        + rating
        + ", createdDate="
        + createdDate
        + ", booking="
        + booking
        + '}';
  }
}
