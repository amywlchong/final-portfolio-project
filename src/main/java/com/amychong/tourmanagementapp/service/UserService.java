package com.amychong.tourmanagementapp.service;

import com.amychong.tourmanagementapp.dto.UserDTO;
import com.amychong.tourmanagementapp.entity.User;

public interface UserService extends GenericService<User, UserDTO>{

    UserDTO update(Integer theId, User theUser);
    UserDTO updatePassword(Integer theId, String newPassword);
    UserDTO updatePhoto(Integer theId, String newPhoto);
    UserDTO updateActiveStatus(Integer theId, Boolean isActive);
    UserDTO updateRole(Integer theId, String newRole);

}
