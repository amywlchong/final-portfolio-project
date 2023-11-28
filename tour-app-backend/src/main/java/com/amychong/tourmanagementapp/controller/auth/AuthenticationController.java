package com.amychong.tourmanagementapp.controller.auth;

import com.amychong.tourmanagementapp.dto.auth.AuthenticationRequestDTO;
import com.amychong.tourmanagementapp.dto.auth.AuthenticationResponseDTO;
import com.amychong.tourmanagementapp.dto.auth.RegisterRequestDTO;
import com.amychong.tourmanagementapp.dto.auth.UpdatePasswordRequestDTO;
import com.amychong.tourmanagementapp.service.auth.AuthenticationServiceImpl;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    private final AuthenticationServiceImpl authService;

    @Autowired
    public AuthenticationController(AuthenticationServiceImpl authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponseDTO> register(
            @NotNull @Valid @RequestBody RegisterRequestDTO requestBody
    ) {
        return new ResponseEntity<>(authService.register(requestBody), HttpStatus.OK);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponseDTO> authenticate(
            @NotNull @Valid @RequestBody AuthenticationRequestDTO requestBody
    ) {
        return new ResponseEntity<>(authService.authenticate(requestBody), HttpStatus.OK);
    }

    @PutMapping("/update-my-password")
    public ResponseEntity<AuthenticationResponseDTO> updatePassword(
            @NotNull @Valid @RequestBody UpdatePasswordRequestDTO requestBody
    ) {
        return new ResponseEntity<>(
                authService.updatePassword(requestBody.getOldPassword(), requestBody.getNewPassword()),
                HttpStatus.OK
        );
    }
}
