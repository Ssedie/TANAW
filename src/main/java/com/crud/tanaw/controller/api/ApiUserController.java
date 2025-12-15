
package com.crud.tanaw.controller.api;

import com.crud.tanaw.dto.ReqRep.ResetPasswordRequest;
import com.crud.tanaw.dto.UserDTO;
import com.crud.tanaw.dto.ReqRep.UpdateProfileRequest;
import com.crud.tanaw.entities.ResetToken;
import com.crud.tanaw.entities.User;
import com.crud.tanaw.services.PasswordRateLimiter;
import com.crud.tanaw.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class ApiUserController {

    private final UserService userService;

    private final PasswordRateLimiter limiter;

    public ApiUserController(UserService userService, PasswordRateLimiter limiter) {
        this.userService = userService;
        this.limiter = limiter;
    }

    @Value("${app.super-admin-id}")
    private Integer superAdminId;

    @Value("${app.super-admin-password}")
    private String superAdminPassword;


    @GetMapping("/profile")
    public UserDTO getProfile(Authentication authentication) {
        Long userId = Long.valueOf(authentication.getName());

        if (userId.equals(superAdminId.longValue())) {
            return new UserDTO(
                    superAdminId,
                    "Super",               // fName
                    null,                  // mName
                    "Admin",               // lName
                    "superadmin@tanaw.com", // email
                    "ADMIN",               // role
                    null,                  // phoneNumber
                    null, null, null, null, null, null, null, null, // address
                    null, // picturePath
                    "ACTIVE"               // accountStatus
            );
        }

        User user = userService.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToDTO(user);
    }

    @PutMapping(value ="/profile", consumes = "multipart/form-data")
    public UserDTO updateProfile(
            @ModelAttribute @Valid UpdateProfileRequest request,
            BindingResult bindingResult,
            Authentication authentication) {

        Long userId = Long.valueOf(authentication.getName());

        if (userId.equals(superAdminId.longValue())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot edit Superadmin profile");
        }

        if (bindingResult.hasErrors()) {
            throw new RuntimeException("Validation failed: " + bindingResult.getAllErrors());
        }

        User updatedUser = userService.updateUserProfile(userId, request);
        return mapToDTO(updatedUser);
    }

    private UserDTO mapToDTO(User user) {
        return new UserDTO(
                user.getUserId(),
                user.getFName(),
                user.getMName(),
                user.getLName(),
                user.getEmail(),
                user.getRole(),
                user.getPhoneNumber(),
                user.getStreet(),
                user.getBarangay(),
                user.getCity(),
                user.getProvince(),
                user.getRegion(),
                user.getCountry(),
                user.getZipCode(),
                user.getBirthDate(),
                user.getPicturePath(),
                user.getAccountStatus()
        );
    }

    @PutMapping("/change-password")
    public Map<String, String> changePassword(
            @RequestBody Map<String, String> request,
            Authentication authentication
    ) {
        Long userId = Long.valueOf(authentication.getName());

        if (userId.equals(superAdminId.longValue())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot change Superadmin password");
        }

        String currentPassword = request.get("currentPassword");
        String newPassword = request.get("newPassword");

        userService.changePassword(userId, currentPassword, newPassword);

        return Map.of("message", "Password updated successfully");
    }

    @DeleteMapping("/profile-picture")
    public Map<String, String> deleteProfilePicture(Authentication authentication) {
        Long userId = Long.valueOf(authentication.getName());
        userService.removeProfilePicture(userId);
        return Map.of("message", "Profile picture removed successfully");
    }

    @PostMapping("/check-password")
    public Map<String, Object> checkPassword(
            @RequestBody Map<String, String> request,
            Authentication authentication
    ) {
        Long userId = Long.valueOf(authentication.getName());

        if (userId.equals(superAdminId.longValue())) {
            boolean valid = superAdminPassword.equals(request.get("currentPassword"));
            return Map.of("valid", valid, "locked", false);
        }

        if (limiter.isLocked(userId)) {
            return Map.of("valid", false, "locked", true, "message", "Too many attempts. Try again later.");
        }

        boolean valid = userService.checkPassword(userId, request.get("currentPassword"));

        if (!valid) {
            limiter.recordFail(userId);
            return Map.of("valid", false, "locked", false);
        }

        limiter.reset(userId);
        return Map.of("valid", true);
    }

    @PostMapping("/forgot-password")
    public Map<String, String> forgotPassword(
            @RequestParam Long userId,
            @RequestParam String email,
            @RequestParam String birthDate // format: yyyy-MM-dd
    ) {
        User user = userService.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Verify email
        if (!user.getEmail().equalsIgnoreCase(email)) {
            throw new RuntimeException("Email does not match user ID");
        }

        // Verify birth date
        if (!user.getBirthDate().equals(birthDate)) {
            throw new RuntimeException("Birth date does not match our records");
        }

        // Generate reset token
        ResetToken token = userService.createResetToken(userId);

        // TODO: send token via email
        return Map.of(
                "message", "Password reset token has been sent to your email",
                "token", token.getToken() // only if you want to show in frontend (not recommended)
        );
    }


    // Step 2: Reset password
    @PostMapping("/reset-password")
    public Map<String, String> resetPassword(@RequestBody ResetPasswordRequest request) {
        if (request.getUserId() == null || request.getToken() == null || request.getPassword() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing userId, token, or password");
        }

        userService.resetPassword(request.getUserId(), request.getToken(), request.getPassword());

        return Map.of("message", "Password reset successfully");
    }



}
