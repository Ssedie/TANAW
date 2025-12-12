
package com.crud.tanaw.controller.api;

import com.crud.tanaw.dto.UserDTO;
import com.crud.tanaw.dto.ReqRep.UpdateProfileRequest;
import com.crud.tanaw.entities.User;
import com.crud.tanaw.services.UserService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class ApiUserController {

    private final UserService userService;

    public ApiUserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public UserDTO getProfile(Authentication authentication) {
        Long userId = Long.valueOf(authentication.getName());
        User user = userService.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToDTO(user);
    }

    @PutMapping(value ="/profile", consumes = "multipart/form-data")
    public UserDTO updateProfile(
            @ModelAttribute @Valid UpdateProfileRequest request,
            BindingResult bindingResult,
            Authentication authentication) {

        if (bindingResult.hasErrors()) {
            throw new RuntimeException("Validation failed: " + bindingResult.getAllErrors());
        }

        Long userId = Long.valueOf(authentication.getName());
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
}
