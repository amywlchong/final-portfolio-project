package com.amychong.tourmanagementapp.service.user;

import com.amychong.tourmanagementapp.dto.UserDTO;
import com.amychong.tourmanagementapp.entity.user.User;
import com.amychong.tourmanagementapp.service.generic.GenericService;

public interface UserService extends GenericService<User, UserDTO> {

    UserDTO update(Integer theId, User theUser);

    UserDTO updatePassword(Integer theId, String newPassword);

    UserDTO updateActiveStatus(Integer theId, Boolean isActive);

    UserDTO updateRole(Integer theId, String newRole);

    void validateUserRole(Integer userId, String exceptionMessage, String... expectedRoles);
}
