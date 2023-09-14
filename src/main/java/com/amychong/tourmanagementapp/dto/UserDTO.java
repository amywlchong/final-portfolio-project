package com.amychong.tourmanagementapp.dto;

public class UserDTO {

    private Integer id;
    private String name;
    private String email;
    private Boolean active;
    private String userRole;

    // Default constructor
    public UserDTO() {

    }

    // Parameterized constructor
    public UserDTO(Integer id, String name, String email, Boolean active, String userRole) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.active = active;
        this.userRole = userRole;
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
                ", active=" + active +
                ", userRole=" + userRole +
                '}';
    }
}

