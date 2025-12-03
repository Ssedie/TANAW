package com.crud.tanaw.controller.api;

import com.crud.tanaw.dto.UserDTO;
import com.crud.tanaw.dto.ReqRep.UpdateProfileRequest;
import com.crud.tanaw.entities.User;
import com.crud.tanaw.services.UserService;
import org.springframework.security.core.Authentication;
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
        Long userId = Long.valueOf(authentication.getName()); // make sure this is userId
        User user = userService.findByUserId(userId);
        return mapToDTO(user);
    }

    @PutMapping("/profile")
    public UserDTO updateProfile(@RequestBody UpdateProfileRequest request,
                                 Authentication authentication) {
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
                user.getBirthDate()
        );
    }
}

