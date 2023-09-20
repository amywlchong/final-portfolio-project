package com.amychong.tourmanagementapp.service.user;

import com.amychong.tourmanagementapp.dto.UserDTO;
import com.amychong.tourmanagementapp.entity.user.Role;
import com.amychong.tourmanagementapp.exception.NotFoundException;
import com.amychong.tourmanagementapp.entity.user.User;
import com.amychong.tourmanagementapp.mapper.UserMapper;
import com.amychong.tourmanagementapp.repository.user.UserRepository;
import com.amychong.tourmanagementapp.service.helper.ValidationHelper;
import com.amychong.tourmanagementapp.service.generic.GenericServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServiceImpl extends GenericServiceImpl<User, UserDTO> implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Autowired
    public UserServiceImpl(UserRepository theUserRepository, UserMapper theUserMapper) {
        super(theUserRepository, User.class, UserDTO.class, theUserMapper);
        userRepository = theUserRepository;
        userMapper = theUserMapper;
    }

    private User findSensitiveUserById(Integer theId) {
        ValidationHelper.validateId(theId);
        return userRepository.findById(theId).orElseThrow(() -> new NotFoundException("Did not find user id - " + theId));
    }

    @Override
    @Transactional
    public UserDTO create(User theUser) {
        throw new UnsupportedOperationException("The user creation operation is not supported. Please use the register method provided by AuthenticationService.");
    }

    @Override
    public UserDTO update(Integer theId, User theUser) {
        throw new UnsupportedOperationException("The generic update operation is not supported. Please use the specific update methods provided.");
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
    public UserDTO updateRole(Integer theId, Role newRole) {
        ValidationHelper.validateNotNull(newRole, "Role cannot be null.");

        User existingUser = findSensitiveUserById(theId);
        User copyOfExistingUser = existingUser.deepCopy();
        copyOfExistingUser.setRole(newRole);
        return super.save(copyOfExistingUser);
    }

    @Override
    public boolean verifyInputUserHasRole(Integer userId, String... validRoles) {
        UserDTO existingUser = findById(userId);

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
}
