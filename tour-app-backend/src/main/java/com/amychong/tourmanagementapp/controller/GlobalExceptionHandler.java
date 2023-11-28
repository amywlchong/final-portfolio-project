package com.amychong.tourmanagementapp.controller;

import com.amychong.tourmanagementapp.exception.*;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestValueException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.support.MissingServletRequestPartException;
import software.amazon.awssdk.services.s3.model.S3Exception;

import java.sql.SQLIntegrityConstraintViolationException;
import java.util.List;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler({UsernameNotFoundException.class, BadCredentialsException.class})
  public ResponseEntity<String> handleAuthenticationException(RuntimeException exc) {
    return new ResponseEntity<>("Wrong email or password.", HttpStatus.UNAUTHORIZED);
  }

  @ExceptionHandler(AuthenticatedUserNotFoundException.class)
  public ResponseEntity<String> handleAuthenticatedUserNotFoundException(
      AuthenticatedUserNotFoundException exc) {
    return new ResponseEntity<>(
        "No authenticated user found. Please log in or re-authenticate.", HttpStatus.UNAUTHORIZED);
  }

  @ExceptionHandler(DisabledException.class)
  public ResponseEntity<String> handleDisabledException(DisabledException exc) {
    return new ResponseEntity<>("Account is disabled.", HttpStatus.FORBIDDEN);
  }

  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<String> handleAccessDeniedException(AccessDeniedException exc) {
    return new ResponseEntity<>("Access denied", HttpStatus.FORBIDDEN);
  }

  @ExceptionHandler(PermissionDeniedException.class)
  public ResponseEntity<String> handlePermissionDeniedException(PermissionDeniedException exc) {
    return new ResponseEntity<>(exc.getMessage(), HttpStatus.FORBIDDEN);
  }

  @ExceptionHandler(NotFoundException.class)
  public ResponseEntity<String> handleNotFoundException(NotFoundException exc) {
    return new ResponseEntity<>(exc.getMessage(), HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(HttpMessageNotReadableException.class)
  public ResponseEntity<String> handleHttpMessageNotReadableException(
      HttpMessageNotReadableException exc) {
    return new ResponseEntity<>(exc.getMessage(), HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(MissingRequestValueException.class)
  public ResponseEntity<String> handleMissingRequestValueException(
      MissingRequestValueException exc) {
    return new ResponseEntity<>(exc.getMessage(), HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(MissingServletRequestPartException.class)
  public ResponseEntity<String> handleMissingServletRequestPartException(
      MissingServletRequestPartException exc) {
    return new ResponseEntity<>(exc.getMessage(), HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException exc) {
    return new ResponseEntity<>(exc.getMessage(), HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<String> handleValidationExceptions(MethodArgumentNotValidException exc) {

    List<FieldError> fieldErrors = exc.getBindingResult().getFieldErrors();

    String errorMessage =
        fieldErrors.stream()
            .map(error -> error.getField() + ": " + error.getDefaultMessage())
            .collect(Collectors.joining(", "));

    return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<String> handleConstraintViolationException(
      ConstraintViolationException exc) {
    return new ResponseEntity<>(exc.getMessage(), HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(SQLIntegrityConstraintViolationException.class)
  public ResponseEntity<String> handleSQLIntegrityConstraintViolationException(
      SQLIntegrityConstraintViolationException exc) {
    if (exc.getMessage().contains("foreign key constraint fails")) {
      return new ResponseEntity<>(
          "You're trying to delete a record that cannot be deleted because it is linked to other data in the system.",
          HttpStatus.BAD_REQUEST);
    }
    return new ResponseEntity<>(exc.getMessage(), HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(IllegalStateException.class)
  public ResponseEntity<String> handleIllegalStateException(IllegalStateException exc) {
    return new ResponseEntity<>(exc.getMessage(), HttpStatus.CONFLICT);
  }

  @ExceptionHandler(S3Exception.class)
  public ResponseEntity<String> handleS3Exception(S3Exception exc) {
    String exceptionMessage = exc.awsErrorDetails().errorMessage();
    int statusCode = exc.statusCode();

    if (statusCode == 400) {
      return new ResponseEntity<>(exceptionMessage, HttpStatus.BAD_REQUEST);
    } else if (statusCode == 404) {
      return new ResponseEntity<>(exceptionMessage, HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(exceptionMessage, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  @ExceptionHandler(S3OperationException.class)
  public ResponseEntity<String> handleS3OperationException(S3OperationException exc) {
    return new ResponseEntity<>(exc.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
  }

  @ExceptionHandler(PaymentProcessingException.class)
  public ResponseEntity<String> handlePaymentProcessingException(PaymentProcessingException exc) {
    return new ResponseEntity<>(exc.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
  }

  @ExceptionHandler(UnsupportedOperationException.class)
  public ResponseEntity<String> handleUnsupportedOperationException(
      UnsupportedOperationException exc) {
    return new ResponseEntity<>(exc.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
