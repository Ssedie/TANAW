package com.crud.tanaw.dto.ReqRep;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(

        @NotBlank(message = "Email is required")
        @Email(message = "Email should be valid")
        String email,

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters long")
        String password,

        String role,

        String fName,
        String mName,
        String lName,
        String phoneNumber,
        String birthDate, // string → will convert to Date
        String street,
        String barangay,
        String city,
        String province,
        String region,
        String country,
        Integer zipCode

) {}
