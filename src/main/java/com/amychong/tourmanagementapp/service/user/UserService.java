package com.amychong.tourmanagementapp.service.user;

import com.amychong.tourmanagementapp.dto.user.UserResponseDTO;
import com.amychong.tourmanagementapp.entity.user.Role;
import com.amychong.tourmanagementapp.entity.user.User;
import com.amychong.tourmanagementapp.service.generic.GenericService;

public interface UserService extends GenericService<User, UserResponseDTO> {

    UserResponseDTO update(Integer theId, User theUser);

    UserResponseDTO updateActiveStatus(Integer theId, Boolean isActive);

    UserResponseDTO updateRole(Integer theId, Role newRole);

    boolean verifyInputUserHasRole(Integer userId, String... validRoles);
}
