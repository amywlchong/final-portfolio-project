package com.amychong.tourmanagementapp.mapper;

import com.amychong.tourmanagementapp.dto.UserDTO;
import com.amychong.tourmanagementapp.entity.User;
import com.amychong.tourmanagementapp.entity.UserRole;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel="spring")
public interface UserMapper {

    UserDTO toDTO(User user);

    List<UserDTO> toDTOList(List<User> users);

    default String map(UserRole userRole) {
        return userRole.getRole();
    }

}

