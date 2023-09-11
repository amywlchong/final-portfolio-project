package com.amychong.tourmanagementapp.mapper;

import com.amychong.tourmanagementapp.dto.UserDTO;
import com.amychong.tourmanagementapp.entity.User;
import com.amychong.tourmanagementapp.entity.UserRole;
import org.mapstruct.Mapper;

@Mapper(componentModel="spring")
public interface UserMapper extends GenericMapper<User, UserDTO> {

    default String map(UserRole userRole) {
        return userRole.getRole();
    }

    default UserRole map(String userRoleString) { return new UserRole(userRoleString); }

}

