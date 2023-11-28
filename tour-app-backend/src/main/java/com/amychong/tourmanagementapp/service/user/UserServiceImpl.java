package com.amychong.tourmanagementapp.service.user;

import com.amychong.tourmanagementapp.dto.user.UserResponseDTO;
import com.amychong.tourmanagementapp.entity.user.Role;
import com.amychong.tourmanagementapp.exception.NotFoundException;
import com.amychong.tourmanagementapp.entity.user.User;
import com.amychong.tourmanagementapp.mapper.UserMapper;
import com.amychong.tourmanagementapp.repository.user.UserRepository;
import com.amychong.tourmanagementapp.service.generic.GenericServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class UserServiceImpl extends GenericServiceImpl<User, UserResponseDTO> implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Autowired
    public UserServiceImpl(UserRepository theUserRepository, UserMapper theUserMapper) {
        super(theUserRepository, User.class, UserResponseDTO.class, theUserMapper);
        userRepository = theUserRepository;
        userMapper = theUserMapper;
    }

    private User findSensitiveUserByIdOrThrow(Integer theId) {
        return userRepository.findById(theId).orElseThrow(() -> new NotFoundException("Did not find user id - " + theId));
    }

    @Override
    public List<UserResponseDTO> findAvailableGuidesWithinRange(LocalDate startDate, LocalDate endDate) {
        return userMapper.toDTOList(userRepository.findAvailableGuidesWithinRange(startDate, endDate));
    }

    @Override
    @Transactional
    public UserResponseDTO create(User theUser) {
        throw new UnsupportedOperationException("The user creation operation is not supported. Please use the register method provided by AuthenticationService.");
    }

    @Override
    public UserResponseDTO update(Integer theId, User theUser) {
        throw new UnsupportedOperationException("The generic update operation is not supported. Please use the specific update methods provided.");
    }

    @Override
    @Transactional
    public UserResponseDTO updateActiveStatus(Integer theId, Boolean isActive) {
        User existingUser = findSensitiveUserByIdOrThrow(theId);
        User copyOfExistingUser = existingUser.deepCopy();
        copyOfExistingUser.setActive(isActive);
        return super.save(copyOfExistingUser);
    }

    @Override
    @Transactional
    public UserResponseDTO updateRole(Integer theId, Role newRole) {
        User existingUser = findSensitiveUserByIdOrThrow(theId);
        User copyOfExistingUser = existingUser.deepCopy();
        copyOfExistingUser.setRole(newRole);
        return super.save(copyOfExistingUser);
    }

    @Override
    public boolean verifyInputUserHasRole(Integer userId, String... validRoles) {
        UserResponseDTO existingUser = findByIdOrThrow(userId);

        Role userRole = existingUser.getRole();

        for (String validRole : validRoles) {
            Role validRoleEnum = Role.valueOf(validRole);

            // If a matching role is found, exit early
            if (userRole == validRoleEnum) {
                return true;
            }
        }

        return false;
    }

    @Override
    public boolean verifyInputUserIsActive(Integer userId) {
        UserResponseDTO existingUser = findByIdOrThrow(userId);
        return existingUser.getActive();
    }
}
