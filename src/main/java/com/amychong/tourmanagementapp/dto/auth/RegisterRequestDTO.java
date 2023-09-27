package com.amychong.tourmanagementapp.dto.auth;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;

public class RegisterRequestDTO {

    @NotBlank(message = "Name is mandatory")
    @Size(min = 2, max = 255, message = "Name must be between 2 and 255 characters long")
    private final String name;

    @NotBlank(message = "Email is mandatory")
    @Size(max = 255, message = "Email should have at most 255 characters")
    @Email(message = "Email should be valid")
    private final String email;

    @NotBlank(message = "Password is mandatory")
    @Size(min = 8, max = 50, message = "Password should have at least 8 characters and at most 50 characters")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&+=])(?=\\S+$).{8,}$",
            message = "Password should contain at least one digit, one uppercase letter, one lowercase letter, and one special character (!, @, #, $, %, ^, &, +, or =). No white space is allowed in the password.")
    private final String password;

    @JsonCreator
    public RegisterRequestDTO(@JsonProperty("name") String name, @JsonProperty("email") String email, @JsonProperty("password") String password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    @Override
    public String toString() {
        return "RegisterRequestDTO{" +
                "name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
