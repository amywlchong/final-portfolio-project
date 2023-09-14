package com.amychong.tourmanagementapp.service.user;

import com.amychong.tourmanagementapp.dto.UserDTO;
import com.amychong.tourmanagementapp.entity.user.UserRole;
import com.amychong.tourmanagementapp.exception.NotFoundException;
import com.amychong.tourmanagementapp.entity.user.User;
import com.amychong.tourmanagementapp.mapper.UserMapper;
import com.amychong.tourmanagementapp.repository.user.UserRoleRepository;
import com.amychong.tourmanagementapp.repository.user.UserRepository;
import com.amychong.tourmanagementapp.service.helper.ValidationHelper;
import com.amychong.tourmanagementapp.service.generic.GenericServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class UserServiceImpl extends GenericServiceImpl<User, UserDTO> implements UserService {

    private UserRepository userRepository;
    private UserRoleRepository userRoleRepository;
    private UserMapper userMapper;

    @Autowired
    public UserServiceImpl(UserRepository theUserRepository, UserRoleRepository theUserRoleRepository, UserMapper theUserMapper) {
        super(theUserRepository, theUserMapper, User.class, UserDTO.class);
        userRepository = theUserRepository;
        userRoleRepository = theUserRoleRepository;
        userMapper = theUserMapper;
    }

    private User findSensitiveUserById(Integer theId) {
        ValidationHelper.validateId(theId);
        return userRepository.findById(theId).orElseThrow(() -> new NotFoundException("Did not find user id - " + theId));
    }

    @Override
    @Transactional
    public UserDTO create(User theUser) {
        ValidationHelper.validateNotNull(theUser, "User must not be null.");
        User copyOfTheUser = theUser.deepCopy();
        validateAndSetUserRole(copyOfTheUser, copyOfTheUser.getUserRole().getRole());

        return super.create(copyOfTheUser);
    }

    @Override
    public UserDTO update(Integer theId, User theUser) {
        throw new UnsupportedOperationException("The generic update operation is not supported. Please use the specific update methods provided.");
    }

    @Override
    @Transactional
    public UserDTO updatePassword(Integer theId, String newPassword) {
        ValidationHelper.validateNotBlank(newPassword, "Password cannot be null or blank.");

        User existingUser = findSensitiveUserById(theId);
        User copyOfExistingUser = existingUser.deepCopy();
        copyOfExistingUser.setPassword(newPassword);
        copyOfExistingUser.setPasswordChangedDate(LocalDate.now());
        return super.save(copyOfExistingUser);
    }

    @Override
    @Transactional
    public UserDTO updateActiveStatus(Integer theId, Boolean isActive) {
        ValidationHelper.validateNotNull(isActive, "Active status cannot be null.");

        User existingUser = findSensitiveUserById(theId);
        User copyOfExistingUser = existingUser.deepCopy();
        copyOfExistingUser.setActive(isActive);
        return super.save(copyOfExistingUser);
    }

    @Override
    @Transactional
    public UserDTO updateRole(Integer theId, String newRole) {
        ValidationHelper.validateNotBlank(newRole, "Role cannot be null or blank.");

        User existingUser = findSensitiveUserById(theId);
        User copyOfExistingUser = existingUser.deepCopy();
        validateAndSetUserRole(copyOfExistingUser, newRole);
        return super.save(copyOfExistingUser);
    }

    @Override
    public void validateUserRole(Integer userId, String exceptionMessage, String... validRoles) {
        UserDTO existingUser = findById(userId);
        for (String validRole : validRoles) {
            if (existingUser.getUserRole().equals(validRole)) {
                return;  // If a matching role is found, we exit early
            }
        }
        throw new RuntimeException(exceptionMessage);
    }

    private void validateAndSetUserRole(User theUser, String role) {
        UserRole existingUserRole = userRoleRepository.findByRole(role);
        if (existingUserRole == null) {
            throw new IllegalArgumentException("User role is invalid.");
        }

        theUser.setUserRole(existingUserRole);
    }
}
