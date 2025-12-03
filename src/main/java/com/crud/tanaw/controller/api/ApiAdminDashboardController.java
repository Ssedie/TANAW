package com.crud.tanaw.controller.api;

import com.crud.tanaw.entities.User;
import com.crud.tanaw.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class ApiAdminDashboardController {

    @Value("${app.super-admin-id}")
    private Integer superAdminId;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PutMapping("/role/{userId}")
    public ResponseEntity<?> updateRole(
            @PathVariable Integer userId,
            @RequestParam String role,
            Authentication auth
    ) {
        // The currently logged-in userId
        Integer currentUserId = Integer.parseInt(auth.getName());

        // Only the super admin can edit roles
        if (!currentUserId.equals(superAdminId)) {
            return ResponseEntity.status(403)
                    .body("Only the super admin can change roles.");
        }

        User target = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        target.setRole(role.toUpperCase());
        userRepository.save(target);

        return ResponseEntity.ok("Role updated successfully");
    }

    @PutMapping("/password/{userId}")
    public ResponseEntity<?> updatePassword(
            @PathVariable Integer userId,
            @RequestParam String newPassword,
            Authentication auth
    ) {
        Integer currentUserId = Integer.parseInt(auth.getName());

        // Only super admin can update passwords
        if (!currentUserId.equals(superAdminId)) {
            return ResponseEntity.status(403)
                    .body("Only the super admin can change passwords.");
        }

        User target = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        target.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(target);

        return ResponseEntity.ok("Password updated successfully");
    }

    @PutMapping("/me/password")
    public ResponseEntity<?> updateOwnPassword(
            @RequestParam String oldPassword,
            @RequestParam String newPassword,
            Authentication auth
    ) {
        Integer userId = Integer.parseInt(auth.getName());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Not found"));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            return ResponseEntity.status(400).body("Incorrect old password");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok("Password updated");
    }
}
