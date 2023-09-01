package com.amychong.tourmanagementapp.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name="users")
public class User {

    // define fields
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private int id;

    @Column(name="name")
    private String name;

    @Column(name="email")
    private String email;

    @Column(name="password_hash")
    private String password;

    @Column(name="password_changed_date")
    private LocalDate passwordChangedDate;

    @Column(name="photo")
    private String photo = "default.jpg";

    @Column(name="active")
    private Boolean active = true;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="role_id")
    private UserRole userRole;

    // define constructors
    public User() {

    }

    public User(String name, String email, String password, LocalDate passwordChangedDate, String photo, Boolean active, UserRole userRole) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.passwordChangedDate = passwordChangedDate;
        this.photo = photo;
        this.active = active;
        this.userRole = userRole;
    }

    // define getters and setters

    public int getId() {
        return id;
    }

    public void setId(int id) {
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public LocalDate getPasswordChangedDate() {
        return passwordChangedDate;
    }

    public void setPasswordChangedDate(LocalDate passwordChangedDate) {
        this.passwordChangedDate = passwordChangedDate;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public UserRole getUserRole() { return userRole; }

    public void setUserRole(UserRole userRole) { this.userRole = userRole; }

    // define toString method

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", photo='" + photo + '\'' +
                ", active=" + active +
                ", userRole=" + userRole +
                '}';
    }
}
