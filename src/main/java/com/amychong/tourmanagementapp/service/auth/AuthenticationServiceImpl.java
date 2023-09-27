package com.amychong.tourmanagementapp.service.auth;

import com.amychong.tourmanagementapp.dto.auth.AuthenticationRequestDTO;
import com.amychong.tourmanagementapp.dto.auth.AuthenticationResponseDTO;
import com.amychong.tourmanagementapp.dto.auth.RegisterRequestDTO;
import com.amychong.tourmanagementapp.entity.user.Role;
import com.amychong.tourmanagementapp.entity.user.User;
import com.amychong.tourmanagementapp.exception.AuthenticatedUserNotFoundException;
import com.amychong.tourmanagementapp.repository.user.UserRepository;
import com.amychong.tourmanagementapp.security.AuthenticationFacade;
import com.amychong.tourmanagementapp.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final AuthenticationFacade authenticationFacade;

    @Autowired
    public AuthenticationServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager, AuthenticationFacade authenticationFacade) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.authenticationFacade = authenticationFacade;
    }

    @Override
    @Transactional
    public AuthenticationResponseDTO register(RegisterRequestDTO request) {
        User user = User.builder()
                .name(request.getName())
                .username(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .passwordChangedDate(System.currentTimeMillis())
                .authorities(Role.ROLE_CUSTOMER.toString())
                .build();
        User dbUser = userRepository.save(user);

        String jwtToken = jwtService.generateToken(dbUser);

        return new AuthenticationResponseDTO(jwtToken, dbUser.getId(), dbUser.getName(), dbUser.getActive(), dbUser.getRole());
    }

    @Override
    public AuthenticationResponseDTO authenticate(AuthenticationRequestDTO request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User dbUser = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Did not find user"));

        String jwtToken = jwtService.generateToken(dbUser);

        return new AuthenticationResponseDTO(jwtToken, dbUser.getId(), dbUser.getName(), dbUser.getActive(), dbUser.getRole());
    }

    @Override
    @Transactional
    public AuthenticationResponseDTO updatePassword(String oldPassword, String newPassword) {

        User authenticatedUser = getAuthenticatedUser();

        if (!passwordEncoder.matches(oldPassword, authenticatedUser.getPassword())) {
            throw new BadCredentialsException("Invalid credentials.");
        }

        User copyOfUser = authenticatedUser.deepCopy();
        copyOfUser.setPassword(passwordEncoder.encode(newPassword));
        copyOfUser.setPasswordChangedDate(System.currentTimeMillis());

        User dbUser = userRepository.save(copyOfUser);

        String jwtToken = jwtService.generateToken(dbUser);

        return new AuthenticationResponseDTO(jwtToken, dbUser.getId(), dbUser.getName(), dbUser.getActive(), dbUser.getRole());
    }

    @Override
    public boolean verifyAuthenticatedUserHasRole(Role expectedRole) {
        return expectedRole.equals(getAuthenticatedUser().getRole());
    }

    @Override
    public boolean verifyAuthenticatedUserHasId(Integer expectedUserId) {
        return expectedUserId.equals(getAuthenticatedUser().getId());
    }

    @Override
    public User getAuthenticatedUser() {
        Authentication authentication = authenticationFacade.getAuthentication();

        if(authentication == null || !authentication.isAuthenticated() || !(authentication.getPrincipal() instanceof User)) {
            throw new AuthenticatedUserNotFoundException();
        }

        return (User) authentication.getPrincipal();
    }
}
