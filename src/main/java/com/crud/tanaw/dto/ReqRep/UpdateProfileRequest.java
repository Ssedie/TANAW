package com.crud.tanaw.dto.ReqRep;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;

import java.util.Date;

public record UpdateProfileRequest(
        @NotBlank(message = "Please input your first name")
        String fName,
        @NotBlank(message = "Please input your middle name")
        String mName,
        @NotBlank(message = "Please input your last name")
        String lName,

        @NotBlank(message = "Please input the street")
        String street,
        @NotBlank(message = "Please input the barangay")
        String barangay,
        @NotBlank(message = "Please input the city")
        String city,
        @NotBlank(message = "Please input the province")
        String province,
        @NotBlank(message = "Please input the region")
        String region,
        @NotBlank(message = "Please input the country")
        String country,

        Integer zipCode,           // nullable for updates
        String email,              // optional for update
        String password,           // optional for update
        String role,               // optional for update
        String phoneNumber,        // optional for update
        Date birthDate             // nullable for update
) {}
