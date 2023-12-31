package com.amychong.tourmanagementapp.entity.tour;

import com.amychong.tourmanagementapp.entity.interfaces.DeepCopyable;
import com.amychong.tourmanagementapp.entity.interfaces.Identifiable;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.apache.commons.lang3.SerializationUtils;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "points_of_interest")
public class PointOfInterest implements Identifiable<Integer>, Serializable, DeepCopyable {

  // define fields
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Integer id;

  @NotBlank(message = "Name is required")
  @Size(max = 45, message = "Name should have at most 45 characters")
  @Column(name = "name")
  private final String name;

  @NotBlank(message = "Description is required")
  @Size(max = 255, message = "Description should have at most 255 characters")
  @Column(name = "description")
  private String description;

  @OneToMany(mappedBy = "pointOfInterest", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
  private List<TourPointOfInterest> tourPointsOfInterest = new ArrayList<>();

  // define constructors

  public PointOfInterest() {
    this.name = "UNKNOWN";
  }

  public PointOfInterest(String name, String description) {
    this.name = name;
    this.description = description;
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

  public String getName() {
    return name;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  // deepCopy method
  public PointOfInterest deepCopy() {
    return SerializationUtils.clone(this);
  }

  // define toString method

  @Override
  public String toString() {
    return "PointOfInterest{"
        + "id="
        + id
        + ", name='"
        + name
        + '\''
        + ", description='"
        + description
        + '\''
        + '}';
  }

  // define equals and hashCode
  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    PointOfInterest that = (PointOfInterest) o;
    return Objects.equals(name, that.name);
  }

  @Override
  public int hashCode() {
    return Objects.hash(name);
  }
}
