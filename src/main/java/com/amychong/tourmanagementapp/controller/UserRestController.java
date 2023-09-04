package com.amychong.tourmanagementapp.controller;

import com.amychong.tourmanagementapp.dto.UserDTO;
import com.amychong.tourmanagementapp.entity.User;
import com.amychong.tourmanagementapp.mapper.UserMapper;
import com.amychong.tourmanagementapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserRestController extends GenericRestController<User, UserDTO> {

    private UserService userService;
    private UserMapper userMapper;

    @Autowired
    public UserRestController(UserService theUserService, UserMapper theUserMapper) {
        super(theUserService);
        userService = theUserService;
        userMapper = theUserMapper;
    }

    @PutMapping("/me/password")
    public ResponseEntity<String> updatePassword(@PathVariable int userId, @RequestBody Map<String, String> requestBody) {
        userService.updatePassword(userId, requestBody.get("password"));
        return new ResponseEntity<>("Password updated successfully.", HttpStatus.OK);
    }

    @PutMapping("/{userId}/photo")
    public ResponseEntity<UserDTO> updatePhoto(@PathVariable int userId, @RequestBody Map<String, String> requestBody) {
        UserDTO updatedUser = userService.updatePhoto(userId, requestBody.get("photo"));
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @PutMapping("/{userId}/active")
    public ResponseEntity<UserDTO> updateActiveStatus(@PathVariable int userId, @RequestBody Map<String, Boolean> requestBody) {
        UserDTO updatedUser = userService.updateActiveStatus(userId, requestBody.get("active"));
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @PutMapping("/{userId}/role")
    public ResponseEntity<UserDTO> updateRole(@PathVariable int userId, @RequestBody Map<String, String> requestBody) {
        UserDTO updatedUser = userService.updateRole(userId, requestBody.get("userRole"));
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

}
