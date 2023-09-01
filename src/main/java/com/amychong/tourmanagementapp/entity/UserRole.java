package com.amychong.tourmanagementapp.entity;

import jakarta.persistence.*;


@Entity
@Table(name="roles")
public class UserRole {

    // define fields
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private int id;

    @Column(name="role")
    private String role;


    // define constructors
    public UserRole() {

    }

    public UserRole(String role) {
        this.role = role;
    }

    // define getters and setters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }


    // define toString method

    @Override
    public String toString() {
        return "UserRole{" +
                "id=" + id +
                ", role=" + role +
                '}';
    }
}
