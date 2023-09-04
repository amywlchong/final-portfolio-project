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

    @Override
    public List<UserDTO> findAll() {

        return super.findAll();
    }

    private User findSensitiveUserById(int theId) {
        super.validateId(theId);
        return userRepository.findById(theId).orElseThrow(() -> new NotFoundException("Did not find user id - " + theId));
    }

    @Override
    public UserDTO findById(int theId) {

        return super.findById(theId);
    }

    @Override
    public UserDTO save(User theUser) {
        validateAndSetUserRole(theUser, theUser.getUserRole().getRole());

        return super.save(theUser);
    }

    @Override
    public UserDTO updatePassword(int theId, String newPassword) {
        super.validateNotEmpty(newPassword, "Password cannot be null or empty.");

        User existingUser = findSensitiveUserById(theId);
        existingUser.setPassword(newPassword);
        existingUser.setPasswordChangedDate(LocalDate.now());
        return save(existingUser);
    }

    @Override
    public UserDTO updatePhoto(int theId, String newPhoto) {
        super.validateNotEmpty(newPhoto, "Photo file name cannot be null or empty.");

        User existingUser = findSensitiveUserById(theId);
        existingUser.setPhoto(newPhoto);
        return save(existingUser);
    }

    @Override
    public UserDTO updateActiveStatus(int theId, Boolean isActive) {
        super.validateNotNull(isActive, "Active status cannot be null.");

        User existingUser = findSensitiveUserById(theId);
        existingUser.setActive(isActive);
        return save(existingUser);
    }

    public UserDTO updateRole(int theId, String newRole) {
        super.validateNotEmpty(newRole, "Role cannot be null or empty.");

        User existingUser = findSensitiveUserById(theId);
        validateAndSetUserRole(existingUser, newRole);
        return save(existingUser);
    }

    @Override
    public void deleteById(int theId) {
        super.deleteById(theId);
    }

    private void validateAndSetUserRole(User theUser, String role) {
        UserRole existingUserRole = userRoleRepository.findByRole(role);
        if (existingUserRole == null) {
            throw new IllegalArgumentException("User role does not exist.");
        }

        theUser.setUserRole(existingUserRole);
    }
}
