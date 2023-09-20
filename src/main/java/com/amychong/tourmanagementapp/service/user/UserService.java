package com.amychong.tourmanagementapp.service.user;

import com.amychong.tourmanagementapp.dto.UserDTO;
import com.amychong.tourmanagementapp.entity.user.Role;
import com.amychong.tourmanagementapp.entity.user.User;
import com.amychong.tourmanagementapp.service.generic.GenericService;

public interface UserService extends GenericService<User, UserDTO> {

    UserDTO update(Integer theId, User theUser);

    UserDTO updateActiveStatus(Integer theId, Boolean isActive);

    UserDTO updateRole(Integer theId, Role newRole);

    boolean verifyInputUserHasRole(Integer userId, String... validRoles);
}
