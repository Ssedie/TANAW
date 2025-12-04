package com.crud.tanaw.dto.ReqRep;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AuthRequest(
        @NotNull(message = "User ID is required")
        Integer user_id,
        @NotNull(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters long")
        String password
) {}

