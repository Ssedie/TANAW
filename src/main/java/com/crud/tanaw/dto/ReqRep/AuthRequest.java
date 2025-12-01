package com.crud.tanaw.dto.ReqRep;

import com.crud.tanaw.entities.User;
import jakarta.validation.constraints.NotBlank;

public record AuthRequest(
        @NotBlank(message = "User ID is required")
        int user_id,
        @NotBlank(message = "Password is required")
        String password
) {
}
