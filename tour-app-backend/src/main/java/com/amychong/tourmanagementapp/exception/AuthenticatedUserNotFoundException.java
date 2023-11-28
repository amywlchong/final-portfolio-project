package com.amychong.tourmanagementapp.exception;

public class AuthenticatedUserNotFoundException extends NotFoundException {

  public AuthenticatedUserNotFoundException() {
    super("No authenticated user found.");
  }
}
