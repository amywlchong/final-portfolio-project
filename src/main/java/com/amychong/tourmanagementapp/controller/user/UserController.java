package com.amychong.tourmanagementapp.controller.user;

import com.amychong.tourmanagementapp.controller.generic.GenericController;
import com.amychong.tourmanagementapp.dto.UserDTO;
import com.amychong.tourmanagementapp.entity.user.Role;
import com.amychong.tourmanagementapp.entity.user.User;
import com.amychong.tourmanagementapp.mapper.UserMapper;
import com.amychong.tourmanagementapp.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController extends GenericController<User, UserDTO> {

    private final UserService userService;
    private final UserMapper userMapper;

    @Autowired
    public UserController(UserService theUserService, UserMapper theUserMapper) {
        super(theUserService);
        userService = theUserService;
        userMapper = theUserMapper;
    }

    @PutMapping("/me/password")
    public ResponseEntity<String> updatePassword(@PathVariable Integer userId, @RequestBody Map<String, String> requestBody) {
        userService.updatePassword(userId, requestBody.get("password"));
        return new ResponseEntity<>("Password updated successfully.", HttpStatus.OK);
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

}
