package com.amychong.tourmanagementapp.service.user;

import com.amychong.tourmanagementapp.dto.user.UserResponseDTO;
import com.amychong.tourmanagementapp.entity.user.Role;
import com.amychong.tourmanagementapp.entity.user.User;
import com.amychong.tourmanagementapp.service.generic.GenericService;

import java.time.LocalDate;
import java.util.List;

public interface UserService extends GenericService<User, UserResponseDTO> {

    List<UserResponseDTO> findAvailableGuidesWithinRange(LocalDate startDate, LocalDate endDate);

    UserResponseDTO update(Integer theId, User theUser);

    UserResponseDTO updateActiveStatus(Integer theId, Boolean isActive);

    UserResponseDTO updateRole(Integer theId, Role newRole);

    boolean verifyInputUserHasRole(Integer userId, String... validRoles);

    boolean verifyInputUserIsActive(Integer userId);
}
