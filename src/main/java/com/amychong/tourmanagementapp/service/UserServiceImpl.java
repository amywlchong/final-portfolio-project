package com.amychong.tourmanagementapp.service;

import com.amychong.tourmanagementapp.dto.UserDTO;
import com.amychong.tourmanagementapp.entity.UserRole;
import com.amychong.tourmanagementapp.exception.NotFoundException;
import com.amychong.tourmanagementapp.repository.UserRepository;
import com.amychong.tourmanagementapp.entity.User;
import com.amychong.tourmanagementapp.mapper.UserMapper;
import com.amychong.tourmanagementapp.repository.UserRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;
    private UserRoleRepository userRoleRepository;
    private UserMapper userMapper;

    @Autowired
    public UserServiceImpl(UserRepository theUserRepository, UserRoleRepository theUserRoleRepository, UserMapper theUserMapper) {
        userRepository = theUserRepository;
        userRoleRepository = theUserRoleRepository;
        userMapper = theUserMapper;
    }

    @Override
    public List<UserDTO> findAll() {
        return userMapper.toDTOList(userRepository.findAll());
    }

    private User findSensitiveUserById(int theId) {
        validateId(theId);
        return userRepository.findById(theId).orElseThrow(() -> new NotFoundException("Did not find user id - " + theId));
    }

    @Override
    public UserDTO findById(int theId) {
        return userMapper.toDTO(findSensitiveUserById(theId));
    }

    @Override
    public UserDTO save(User theUser) {
        validateNotNull(theUser, "User must not be null.");
        validateAndSetUserRole(theUser, theUser.getUserRole().getRole());

        return userMapper.toDTO(userRepository.save(theUser));
    }

    @Override
    public UserDTO updatePassword(int theId, String newPassword) {
        validateNotEmpty(newPassword, "Password cannot be null or empty.");

        User existingUser = findSensitiveUserById(theId);
        existingUser.setPassword(newPassword);
        existingUser.setPasswordChangedDate(LocalDate.now());
        return save(existingUser);
    }

    @Override
    public UserDTO updatePhoto(int theId, String newPhoto) {
        validateNotEmpty(newPhoto, "Photo file name cannot be null or empty.");

        User existingUser = findSensitiveUserById(theId);
        existingUser.setPhoto(newPhoto);
        return save(existingUser);
    }

    @Override
    public UserDTO updateActiveStatus(int theId, Boolean isActive) {
        validateNotNull(isActive, "Active status cannot be null.");

        User existingUser = findSensitiveUserById(theId);
        existingUser.setActive(isActive);
        return save(existingUser);
    }

    public UserDTO updateRole(int theId, String newRole) {
        validateNotEmpty(newRole, "Role cannot be null or empty.");

        User existingUser = findSensitiveUserById(theId);
        validateAndSetUserRole(existingUser, newRole);
        return save(existingUser);
    }

    @Override
    public void deleteById(int theId) {
        // find user by id or else throw an exception
        findSensitiveUserById(theId);

        // delete user by id
        userRepository.deleteById(theId);
    }

    private void validateId(int theId) {
        if (theId <= 0) {
            throw new IllegalArgumentException("ID must be a positive number.");
        }
    }

    private void validateNotNull(Object obj, String message) {
        if (obj == null) {
            throw new IllegalArgumentException(message);
        }
    }

    private void validateNotEmpty(String str, String message) {
        if (str == null || str.isEmpty()) {
            throw new IllegalArgumentException(message);
        }
    }

    private void validateAndSetUserRole(User theUser, String role) {
        UserRole existingUserRole = userRoleRepository.findByRole(role);
        if (existingUserRole == null) {
            throw new IllegalArgumentException("User role does not exist.");
        }

        theUser.setUserRole(existingUserRole);
    }
}
