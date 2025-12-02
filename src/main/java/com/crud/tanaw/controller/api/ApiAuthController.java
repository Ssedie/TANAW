package com.crud.tanaw.controller.api;

import com.crud.tanaw.dto.ReqRep.AuthRequest;
import com.crud.tanaw.dto.ReqRep.AuthResponse;
import com.crud.tanaw.dto.ReqRep.RegisterRequest;
import com.crud.tanaw.entities.User;
import com.crud.tanaw.services.JwtTokenService;
import com.crud.tanaw.services.UserService;
import jakarta.validation.Valid;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://127.0.0.1:5173")
public class ApiAuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenService jwtTokenService;
    private final UserService userService;

    public ApiAuthController(AuthenticationManager authenticationManager,
                             JwtTokenService jwtTokenService,
                             UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenService = jwtTokenService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody AuthRequest request) {
        var authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        String.valueOf(request.user_id()), // 6-digit login
                        request.password()
                )
        );

        String token = jwtTokenService.generateToken(authentication);
        Long expiresAt = jwtTokenService.extractExpirationTime(token);

        User user = userService.findByUserId(Long.valueOf(request.user_id()));

        return new AuthResponse(token, Math.toIntExact(user.getUserId()), expiresAt);
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        // Save user in a single transaction
        User savedUser = userService.registerUser(request.email(), request.password());

        // Authenticate using the newly created user
        var authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        String.valueOf(savedUser.getUserId()),
                        request.password()
                )
        );

        String token = jwtTokenService.generateToken(authentication);
        Long expiresAt = jwtTokenService.extractExpirationTime(token);

        return new AuthResponse(token, Math.toIntExact(savedUser.getUserId()), expiresAt);
    }
}
