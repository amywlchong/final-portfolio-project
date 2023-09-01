package com.amychong.tourmanagementapp.service;

import com.amychong.tourmanagementapp.dto.UserDTO;
import com.amychong.tourmanagementapp.entity.User;

import java.util.List;

public interface UserService {

    List<UserDTO> findAll();

    UserDTO findById(int theId);

    UserDTO save(User theUser);

    UserDTO updatePassword(int theId, String newPassword);
    UserDTO updatePhoto(int theId, String newPhoto);
    UserDTO updateActiveStatus(int theId, Boolean isActive);
    UserDTO updateRole(int theId, String newRole);

    void deleteById(int theId);
}
