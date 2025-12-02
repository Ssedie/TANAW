package com.crud.tanaw.controller.api;

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
    public User getProfile(Authentication authentication) {
        String userId = authentication.getName();
        return userService.findByUserId(Long.valueOf(userId));
    }

    @PutMapping("/profile")
    public User updateProfile(@RequestBody UpdateProfileRequest request,
                              Authentication authentication) {
        String userId = authentication.getName();
        return userService.updateUserProfile(Long.valueOf(userId), request);
    }
}