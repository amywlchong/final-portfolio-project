package com.amychong.tourmanagementapp.controller.user;

import com.amychong.tourmanagementapp.dto.UserDTO;
import com.amychong.tourmanagementapp.entity.user.Role;
import com.amychong.tourmanagementapp.mapper.UserMapper;
import com.amychong.tourmanagementapp.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserAdministrationController {

    private final UserService userService;
    private final UserMapper userMapper;

    @Autowired
    public UserAdministrationController(UserService theUserService, UserMapper theUserMapper) {
        userService = theUserService;
        userMapper = theUserMapper;
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAll() {
        return new ResponseEntity<>(userService.findAll(), HttpStatus.OK);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDTO> getById(@PathVariable Integer userId) {
        return new ResponseEntity<>(userService.findById(userId), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<String> add() {
        String message = "Please use /api/auth/register for creating a new user.";
        return new ResponseEntity<>(message, HttpStatus.MOVED_PERMANENTLY);
    }


    @PutMapping("/{userId}/active")
    public ResponseEntity<UserDTO> updateActiveStatus(@PathVariable Integer userId, @RequestBody Map<String, Boolean> requestBody) {
        UserDTO updatedUser = userService.updateActiveStatus(userId, requestBody.get("active"));
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @PutMapping("/{userId}/role")
    public ResponseEntity<UserDTO> updateRole(@PathVariable Integer userId, @RequestBody Map<String, Role> requestBody) {
        UserDTO updatedUser = userService.updateRole(userId, requestBody.get("role"));
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<String> delete(@PathVariable Integer userId) {
        userService.deleteById(userId);
        return new ResponseEntity<>("Deleted user id - " + userId, HttpStatus.OK);
    }

}
