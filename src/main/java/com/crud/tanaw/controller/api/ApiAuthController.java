package com.crud.tanaw.controller.api;

import com.crud.tanaw.dto.ReqRep.AuthRequest;
import com.crud.tanaw.dto.ReqRep.AuthResponse;
import com.crud.tanaw.dto.ReqRep.RegisterRequest;
import com.crud.tanaw.entities.User;
import com.crud.tanaw.exceptions.UserIdNotFoundException;
import com.crud.tanaw.services.JwtTokenService;
import com.crud.tanaw.services.PasswordResetService;
import com.crud.tanaw.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.crud.tanaw.exceptions.UserIdNotFoundException;


import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class ApiAuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenService jwtTokenService;
    private final UserService userService;
    private final PasswordResetService passwordResetService;

    @Value("${app.super-admin-id}")
    private Integer superAdminId;

    @Value("${app.super-admin-password}")
    private String superAdminPassword;

    public ApiAuthController(AuthenticationManager authenticationManager,
                             JwtTokenService jwtTokenService,
                             UserService userService, PasswordResetService passwordResetService) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenService = jwtTokenService;
        this.userService = userService;
        this.passwordResetService = passwordResetService;
    }

    // ----------------------------------------------------
    // LOGIN
    // ----------------------------------------------------
    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody AuthRequest request) {

        // Super Admin login (unchanged)
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
        User user = userService.findByUserId(userId)
                .orElseThrow(() -> new UserIdNotFoundException("User not found"));

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        String.valueOf(userId),
                        request.password()
                )
        );

        String token = jwtTokenService.generateToken(authentication);
        Long expiresAt = jwtTokenService.extractExpirationTime(token);

        String fName = user.getFName() != null ? user.getFName() : "";
        String lName = user.getLName() != null ? user.getLName() : "";
        String picturePath = user.getPicturePath(); // ✅ include picture path

        return new AuthResponse(
                token,
                user.getUserId(),
                expiresAt,
                user.getRole(),
                fName,
                lName,
                picturePath
        );
    }


    // ----------------------------------------------------
    // REGISTER
    // ----------------------------------------------------
    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {

        String assignedRole = "CITIZEN";

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
                savedUser.getPicturePath() // ✅ include picture path
        );


    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, Object> body) {
        try {
            Long userId = Long.valueOf(body.get("user_id").toString());

            // Optional: check if user exists
            if (!userService.findByUserId(userId).isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "User ID not found"));
            }

            // Generate reset token
            String token = passwordResetService.createResetToken(userId);

            // Instead of email, just return the token for now
            return ResponseEntity.ok(Map.of(
                    "message", "Reset token generated!",
                    "token", token
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

}