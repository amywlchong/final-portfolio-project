package com.amychong.tourmanagementapp.service;

import com.amychong.tourmanagementapp.dto.UserDTO;
import com.amychong.tourmanagementapp.entity.User;

public interface UserService extends GenericService<User, UserDTO>{

    UserDTO updatePassword(int theId, String newPassword);
    UserDTO updatePhoto(int theId, String newPhoto);
    UserDTO updateActiveStatus(int theId, Boolean isActive);
    UserDTO updateRole(int theId, String newRole);

}
