package com.crud.tanaw.dto.ReqRep;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "User ID is required")
        @Size(message = "User ID must be 6 characters long")
        int user_id,

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters long")
        String password
) {
}
