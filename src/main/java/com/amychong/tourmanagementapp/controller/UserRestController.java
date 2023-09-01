package com.amychong.tourmanagementapp.controller;

import com.amychong.tourmanagementapp.dto.UserDTO;
import com.amychong.tourmanagementapp.entity.User;
import com.amychong.tourmanagementapp.exception.NotFoundException;
import com.amychong.tourmanagementapp.mapper.UserMapper;
import com.amychong.tourmanagementapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserRestController {

    private UserService userService;
    private UserMapper userMapper;

    @Autowired
    public UserRestController(UserService theUserService, UserMapper theUserMapper) {
        userService = theUserService;
        userMapper = theUserMapper;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return new ResponseEntity<>(userService.findAll(), HttpStatus.OK);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<UserDTO> getUser(@PathVariable int userId) {

        UserDTO theUser = userService.findById(userId);

        return new ResponseEntity<>(theUser, HttpStatus.OK);
    }

    @PostMapping("/users")
    public ResponseEntity<UserDTO> addUser(@RequestBody User theUser) {

        // just in case they pass an id in JSON
        // set id to 0
        // to force a save of new item instead of update

        theUser.setId(0);

        UserDTO dbUser = userService.save(theUser);

        return new ResponseEntity<>(dbUser, HttpStatus.CREATED);
    }

    @PatchMapping("/users/me/password")
    public ResponseEntity<String> updatePassword(@PathVariable int userId, @RequestBody Map<String, String> requestBody) {
        userService.updatePassword(userId, requestBody.get("password"));
        return new ResponseEntity<>("Password updated successfully.", HttpStatus.OK);
    }

    @PatchMapping("/users/{userId}/photo")
    public ResponseEntity<UserDTO> updatePhoto(@PathVariable int userId, @RequestBody Map<String, String> requestBody) {
        UserDTO updatedUser = userService.updatePhoto(userId, requestBody.get("photo"));
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @PatchMapping("/users/{userId}/active")
    public ResponseEntity<UserDTO> updateActiveStatus(@PathVariable int userId, @RequestBody Map<String, Boolean> requestBody) {
        UserDTO updatedUser = userService.updateActiveStatus(userId, requestBody.get("active"));
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @PatchMapping("/users/{userId}/role")
    public ResponseEntity<UserDTO> updateRole(@PathVariable int userId, @RequestBody Map<String, String> requestBody) {
        UserDTO updatedUser = userService.updateRole(userId, requestBody.get("userRole"));
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable int userId) {

        userService.deleteById(userId);

        return new ResponseEntity<>("Deleted user id - " + userId, HttpStatus.OK);
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<String> handleNotFoundException(NotFoundException exc) {
        return new ResponseEntity<>(exc.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException exc) {
        return new ResponseEntity<>(exc.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<String> handleHttpMessageNotReadableException(HttpMessageNotReadableException exc) {
        return new ResponseEntity<>("Required data missing or invalid.", HttpStatus.BAD_REQUEST);
    }
}
