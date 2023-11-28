package com.amychong.tourmanagementapp.mapper;

import com.amychong.tourmanagementapp.dto.user.UserResponseDTO;
import com.amychong.tourmanagementapp.entity.user.User;
import com.amychong.tourmanagementapp.service.EntityLookup;
import org.mapstruct.Mapper;

@Mapper(componentModel="spring")
public interface UserMapper extends GenericMapper<User, UserResponseDTO> {

    static User mapToUser(Integer userId, EntityLookup entityLookup) {
        return entityLookup.findUserByIdOrThrow(userId);
    }
}
