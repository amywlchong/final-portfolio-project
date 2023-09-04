package com.amychong.tourmanagementapp.dto;

public class UserDTO {

    private int id;
    private String name;
    private String email;
    private String photo;
    private Boolean active;
    private String userRole;

    // Default constructor
    public UserDTO() {

    }

    // Parameterized constructor
    public UserDTO(int id, String name, String email, String photo, Boolean active, String userRole) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.photo = photo;
        this.active = active;
        this.userRole = userRole;
    }

    // Getters and setters

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

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) { this.active = active; }

    public String getUserRole() { return userRole; }

    public void setUserRole(String userRole) { this.userRole = userRole; }

    // toString method

    @Override
    public String toString() {
        return "UserDTO{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", photo='" + photo + '\'' +
                ", active=" + active +
                ", userRole=" + userRole +
                '}';
    }
}

