package com.crud.tanaw.controller.api;

import com.crud.tanaw.dto.ReqRep.AuthRequest;
import com.crud.tanaw.dto.ReqRep.AuthResponse;
import com.crud.tanaw.dto.ReqRep.RegisterRequest;
import com.crud.tanaw.entities.User;
import com.crud.tanaw.services.JwtTokenService;
import com.crud.tanaw.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
public class ApiAuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenService jwtTokenService;
    private final UserService userService;

    @Value("${app.super-admin-id}")
    private Integer superAdminId;

    @Value("${app.super-admin-password}")
    private String superAdminPassword;

    public ApiAuthController(AuthenticationManager authenticationManager,
                             JwtTokenService jwtTokenService,
                             UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenService = jwtTokenService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody AuthRequest request) {

        // 1️⃣ Special case: SUPER ADMIN login
        if (Integer.valueOf(request.user_id()).equals(superAdminId)) {
            if (!request.password().equals(superAdminPassword)) {
                throw new BadCredentialsException("Incorrect User Id or Password");
            }

            // Create an Authentication object for the super admin
            Authentication superAdminAuth = new UsernamePasswordAuthenticationToken(
                    superAdminId.toString(),
                    null,
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"))
            );

            String token = jwtTokenService.generateToken(superAdminAuth);
            Long expiresAt = jwtTokenService.extractExpirationTime(token);

            return new AuthResponse(token, superAdminId, expiresAt, "ADMIN");
        }

        // 2️⃣ Normal user login
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        String.valueOf(request.user_id()),
                        request.password()
                )
        );

        String token = jwtTokenService.generateToken(authentication);
        Long expiresAt = jwtTokenService.extractExpirationTime(token);

        User user = userService.findByUserId(Long.valueOf(request.user_id()));

        return new AuthResponse(token, user.getUserId(), expiresAt, user.getRole());
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {

        // Always default to CITIZEN on self signup
        String assignedRole = "CITIZEN";

        // Prevent user self-registering as admin
        if (request.role() != null && request.role().equalsIgnoreCase("ADMIN")) {
            throw new RuntimeException("Admin accounts cannot be created from public signup.");
        }

        User savedUser = userService.registerUser(
                request.email(),
                request.password(),
                assignedRole,
                request.fName(),
                request.mName(),
                request.lName(),
                request.phoneNumber(),
                request.birthDate(),
                request.street(),
                request.barangay(),
                request.city(),
                request.province(),
                request.region(),
                request.country(),
                request.zipCode()
        );

        // Authenticate new user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        String.valueOf(savedUser.getUserId()),
                        request.password()
                )
        );

        String token = jwtTokenService.generateToken(authentication);
        Long expiresAt = jwtTokenService.extractExpirationTime(token);

        return new AuthResponse(
                token,
                savedUser.getUserId(),
                expiresAt,
                savedUser.getRole()
        );
    }

}
