package com.amychong.tourmanagementapp.service;

import com.amychong.tourmanagementapp.dto.UserDTO;
import com.amychong.tourmanagementapp.entity.UserRole;
import com.amychong.tourmanagementapp.exception.NotFoundException;
import com.amychong.tourmanagementapp.entity.User;
import com.amychong.tourmanagementapp.mapper.UserMapper;
import com.amychong.tourmanagementapp.repository.UserRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class UserServiceImpl extends GenericServiceImpl<User, UserDTO> implements UserService {

    private com.amychong.tourmanagementapp.repository.UserRepository userRepository;
    private UserRoleRepository userRoleRepository;
    private UserMapper userMapper;

    @Autowired
    public UserServiceImpl(com.amychong.tourmanagementapp.repository.UserRepository theUserRepository, UserRoleRepository theUserRoleRepository, UserMapper theUserMapper) {
        super(theUserRepository, theUserMapper, User.class, UserDTO.class);
        userRepository = theUserRepository;
        userRoleRepository = theUserRoleRepository;
        userMapper = theUserMapper;
    }

    private User findSensitiveUserById(Integer theId) {
        super.validateId(theId);
        return userRepository.findById(theId).orElseThrow(() -> new NotFoundException("Did not find user id - " + theId));
    }

    @Override
    @Transactional
    public UserDTO create(User theUser) {
        validateNotNull(theUser, "User must not be null.");
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
        super.validateNotEmpty(newPassword, "Password cannot be null or empty.");

        User existingUser = findSensitiveUserById(theId);
        User copyOfExistingUser = existingUser.deepCopy();
        copyOfExistingUser.setPassword(newPassword);
        copyOfExistingUser.setPasswordChangedDate(LocalDate.now());
        return super.save(copyOfExistingUser);
    }

    @Override
    @Transactional
    public UserDTO updatePhoto(Integer theId, String newPhoto) {
        super.validateNotEmpty(newPhoto, "Photo file name cannot be null or empty.");

        User existingUser = findSensitiveUserById(theId);
        User copyOfExistingUser = existingUser.deepCopy();
        copyOfExistingUser.setPhoto(newPhoto);
        return super.save(copyOfExistingUser);
    }

    @Override
    @Transactional
    public UserDTO updateActiveStatus(Integer theId, Boolean isActive) {
        super.validateNotNull(isActive, "Active status cannot be null.");

        User existingUser = findSensitiveUserById(theId);
        User copyOfExistingUser = existingUser.deepCopy();
        copyOfExistingUser.setActive(isActive);
        return super.save(copyOfExistingUser);
    }

    @Override
    @Transactional
    public UserDTO updateRole(Integer theId, String newRole) {
        super.validateNotEmpty(newRole, "Role cannot be null or empty.");

        User existingUser = findSensitiveUserById(theId);
        User copyOfExistingUser = existingUser.deepCopy();
        validateAndSetUserRole(copyOfExistingUser, newRole);
        return super.save(copyOfExistingUser);
    }

    private void validateAndSetUserRole(User theUser, String role) {
        UserRole existingUserRole = userRoleRepository.findByRole(role);
        if (existingUserRole == null) {
            throw new IllegalArgumentException("User role is invalid.");
        }

        theUser.setUserRole(existingUserRole);
    }
}
