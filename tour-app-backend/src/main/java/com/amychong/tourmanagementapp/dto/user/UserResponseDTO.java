package com.amychong.tourmanagementapp.dto.user;

import com.amychong.tourmanagementapp.entity.user.Role;

import java.time.LocalDate;

public class UserResponseDTO {

  private Integer id;
  private String name;
  private String email;
  private Boolean active;
  private Role role;
  private LocalDate signupDate;

  // Default constructor
  public UserResponseDTO() {}

  // Parameterized constructor
  public UserResponseDTO(
      Integer id, String name, String email, Boolean active, Role role, LocalDate signupDate) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.active = active;
    this.role = role;
    this.signupDate = signupDate;
  }

  // Getters and setters

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public Boolean getActive() {
    return active;
  }

  public void setActive(Boolean active) {
    this.active = active;
  }

  public Role getRole() {
    return role;
  }

  public void setRole(Role role) {
    this.role = role;
  }

  public LocalDate getSignupDate() {
    return signupDate;
  }

  public void setSignupDate(LocalDate signupDate) {
    this.signupDate = signupDate;
  }

  // toString method
  @Override
  public String toString() {
    return "UserResponseDTO{"
        + "id="
        + id
        + ", name='"
        + name
        + '\''
        + ", email='"
        + email
        + '\''
        + ", active="
        + active
        + ", role="
        + role
        + ", signupDate="
        + signupDate
        + '}';
  }
}
