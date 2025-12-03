package com.crud.tanaw.controller.api;

import com.crud.tanaw.entities.User;
import com.crud.tanaw.repositories.UserRepository;
import com.crud.tanaw.services.CustomUserDetails;
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

    // Only super admin can get all users
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(Authentication auth) {
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        Integer currentUserId = userDetails.getUserId();

        if (!currentUserId.equals(superAdminId)) {
            return ResponseEntity.status(403).body("Only the super admin can access this endpoint.");
        }

        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    // Only super admin can update roles
    @PutMapping("/role/{userId}")
    public ResponseEntity<?> updateRole(
            @PathVariable Integer userId,
            @RequestParam String role,
            Authentication auth
    ) {
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        Integer currentUserId = userDetails.getUserId();

        if (!currentUserId.equals(superAdminId)) {
            return ResponseEntity.status(403).body("Only the super admin can change roles.");
        }

        User target = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        target.setRole(role.toUpperCase());
        userRepository.save(target);

        return ResponseEntity.ok("Role updated successfully");
    }

    // Only super admin can update another user's info
    @PutMapping("/users/{userId}")
    public ResponseEntity<?> updateUser(
            @PathVariable Integer userId,
            @RequestBody User updatedUser,
            Authentication auth
    ) {
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        Integer currentUserId = userDetails.getUserId();

        if (!currentUserId.equals(superAdminId)) {
            return ResponseEntity.status(403).body("Only the super admin can update user information.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update fields
        user.setFName(updatedUser.getFName());
        user.setMName(updatedUser.getMName());
        user.setLName(updatedUser.getLName());
        user.setEmail(updatedUser.getEmail());
        user.setPhoneNumber(updatedUser.getPhoneNumber());
        user.setBirthDate(updatedUser.getBirthDate());
        user.setStreet(updatedUser.getStreet());
        user.setBarangay(updatedUser.getBarangay());
        user.setCity(updatedUser.getCity());
        user.setProvince(updatedUser.getProvince());
        user.setRegion(updatedUser.getRegion());
        user.setCountry(updatedUser.getCountry());
        user.setZipCode(updatedUser.getZipCode());

        userRepository.save(user);

        return ResponseEntity.ok("User information updated successfully");
    }

    // Only super admin can update another user's password
    @PutMapping("/password/{userId}")
    public ResponseEntity<?> updatePassword(
            @PathVariable Integer userId,
            @RequestParam String newPassword,
            Authentication auth
    ) {
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        Integer currentUserId = userDetails.getUserId();

        if (!currentUserId.equals(superAdminId)) {
            return ResponseEntity.status(403).body("Only the super admin can change passwords.");
        }

        User target = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        target.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(target);

        return ResponseEntity.ok("Password updated successfully");
    }

    // Any user can update their own password
    @PutMapping("/me/password")
    public ResponseEntity<?> updateOwnPassword(
            @RequestParam String oldPassword,
            @RequestParam String newPassword,
            Authentication auth
    ) {
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        Integer userId = userDetails.getUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            return ResponseEntity.status(400).body("Incorrect old password");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok("Password updated");
    }
}
