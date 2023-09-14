package com.amychong.tourmanagementapp.mapper;

import com.amychong.tourmanagementapp.dto.UserDTO;
import com.amychong.tourmanagementapp.entity.user.User;
import com.amychong.tourmanagementapp.entity.user.UserRole;
import org.mapstruct.Mapper;

@Mapper(componentModel="spring")
public interface UserMapper extends GenericMapper<User, UserDTO> {

    default String map(UserRole userRole) {
        return userRole.getRole();
    }

    default UserRole map(String userRoleString) { return new UserRole(userRoleString); }

}

