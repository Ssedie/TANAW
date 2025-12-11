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

        // Super Admin login
        if (Integer.valueOf(request.user_id()).equals(superAdminId)) {
            if (!request.password().equals(superAdminPassword)) {
                throw new BadCredentialsException("Incorrect User Id or Password");
            }

            String token = jwtTokenService.generateToken(superAdminId.longValue(), "ADMIN");
            Long expiresAt = jwtTokenService.extractExpirationTime(token);

            return new AuthResponse(token, superAdminId, expiresAt, "ADMIN", "Super", "Admin", null);
        }

        // Normal user login
        Long userId = Long.valueOf(request.user_id());

        // 1️⃣ Fetch user safely
        User user = userService.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2️⃣ Authenticate
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        String.valueOf(userId),
                        request.password()
                )
        );

        // 3️⃣ Generate JWT token
        String token = jwtTokenService.generateToken(authentication);
        Long expiresAt = jwtTokenService.extractExpirationTime(token);

        String fName = user.getFName() != null ? user.getFName() : "";
        String lName = user.getLName() != null ? user.getLName() : "";

        String picturePath = user.getPicturePath();

        return new AuthResponse(token, user.getUserId(), expiresAt, user.getRole(), fName, lName, picturePath);
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
                savedUser.getRole(),
                savedUser.getFName(),
                savedUser.getLName(),
                savedUser.getAccountStatus()
        );
    }

}