package com.amychong.tourmanagementapp.mapper;

import com.amychong.tourmanagementapp.dto.UserDTO;
import com.amychong.tourmanagementapp.entity.user.User;
import org.mapstruct.Mapper;

@Mapper(componentModel="spring")
public interface UserMapper extends GenericMapper<User, UserDTO> {

}

