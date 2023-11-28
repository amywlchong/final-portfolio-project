package com.amychong.tourmanagementapp.dto.auth;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UpdatePasswordRequestDTO {

  @NotBlank(message = "Old password is mandatory")
  private final String oldPassword;

  @NotBlank(message = "New password is mandatory")
  @Size(
      min = 8,
      max = 50,
      message = "New password should have at least 8 characters and at most 50 characters")
  @Pattern(
      regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&+=])(?=\\S+$).{8,}$",
      message =
          "Password should contain at least one digit, one uppercase letter, one lowercase letter, and one special character (!, @, #, $, %, ^, &, +, or =). No white space is allowed in the password.")
  private final String newPassword;

  @JsonCreator
  public UpdatePasswordRequestDTO(
      @JsonProperty("oldPassword") String oldPassword,
      @JsonProperty("newPassword") String newPassword) {
    this.oldPassword = oldPassword;
    this.newPassword = newPassword;
  }

  public String getOldPassword() {
    return oldPassword;
  }

  public String getNewPassword() {
    return newPassword;
  }

  @Override
  public String toString() {
    return "UpdatePasswordRequestDTO{"
        + "oldPassword='"
        + oldPassword
        + '\''
        + ", newPassword='"
        + newPassword
        + '\''
        + '}';
  }
}
