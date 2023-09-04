package com.amychong.tourmanagementapp.entity;

import jakarta.persistence.*;


@Entity
@Table(name="roles")
public class UserRole implements Identifiable<Integer> {

    // define fields
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Integer id;

    @Column(name="role")
    private String role;


    // define constructors
    public UserRole() {

    }

    public UserRole(String role) {
        this.role = role;
    }

    // define getters and setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
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
