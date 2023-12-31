package com.amychong.tourmanagementapp.controller.user;

import com.amychong.tourmanagementapp.dto.user.UserResponseDTO;
import com.amychong.tourmanagementapp.entity.user.Role;
import com.amychong.tourmanagementapp.mapper.UserMapper;
import com.amychong.tourmanagementapp.service.user.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserAdministrationController {

  private final UserService userService;
  private final UserMapper userMapper;

  @Autowired
  public UserAdministrationController(UserService theUserService, UserMapper theUserMapper) {
    userService = theUserService;
    userMapper = theUserMapper;
  }

  @PreAuthorize("hasRole('ADMIN')")
  @GetMapping
  public ResponseEntity<List<UserResponseDTO>> getAll() {
    return new ResponseEntity<>(userService.findAll(), HttpStatus.OK);
  }

  @PreAuthorize("hasRole('ADMIN')")
  @GetMapping("/{userId}")
  public ResponseEntity<UserResponseDTO> getById(@Min(1) @PathVariable Integer userId) {
    return new ResponseEntity<>(userService.findByIdOrThrow(userId), HttpStatus.OK);
  }

  @PreAuthorize("hasAnyRole('LEAD_GUIDE','ADMIN')")
  @GetMapping("/available-guides")
  public ResponseEntity<List<UserResponseDTO>> getAvailableGuidesWithinRange(
      @NotNull @RequestParam("startDate") LocalDate startDate,
      @NotNull @RequestParam("endDate") LocalDate endDate) {

    List<UserResponseDTO> availableGuides =
        userService.findAvailableGuidesWithinRange(startDate, endDate);

    return new ResponseEntity<>(availableGuides, HttpStatus.OK);
  }

  @PreAuthorize("hasRole('ADMIN')")
  @PostMapping
  public ResponseEntity<String> add() {
    String message = "Please use /api/auth/register for creating a new user.";
    return new ResponseEntity<>(message, HttpStatus.MOVED_PERMANENTLY);
  }

  @PreAuthorize("hasRole('ADMIN')")
  @PutMapping("/{userId}/active")
  public ResponseEntity<UserResponseDTO> updateActiveStatus(
      @Min(1) @PathVariable Integer userId,
      @NotNull @Valid @RequestBody Map<String, Boolean> requestBody) {
    UserResponseDTO updatedUser = userService.updateActiveStatus(userId, requestBody.get("active"));
    return new ResponseEntity<>(updatedUser, HttpStatus.OK);
  }

  @PreAuthorize("hasRole('ADMIN')")
  @PutMapping("/{userId}/role")
  public ResponseEntity<UserResponseDTO> updateRole(
      @Min(1) @PathVariable Integer userId,
      @NotNull @Valid @RequestBody Map<String, Role> requestBody) {
    UserResponseDTO updatedUser = userService.updateRole(userId, requestBody.get("role"));
    return new ResponseEntity<>(updatedUser, HttpStatus.OK);
  }

  @PreAuthorize("hasRole('ADMIN')")
  @DeleteMapping("/{userId}")
  public ResponseEntity<String> delete(@Min(1) @PathVariable Integer userId) {
    userService.deleteById(userId);
    return new ResponseEntity<>("Deleted user id - " + userId, HttpStatus.OK);
  }
}
