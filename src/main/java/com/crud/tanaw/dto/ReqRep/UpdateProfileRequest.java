
package com.crud.tanaw.dto.ReqRep;

import org.springframework.web.multipart.MultipartFile;

public record UpdateProfileRequest(
        String fName,
        String mName,
        String lName,
        String street,
        String barangay,
        String city,
        String province,
        String region,
        String country,
        Integer zipCode,     // nullable for updates
        String email,        // optional for update
        String password,     // optional for update
        String role,         // optional for update
        String phoneNumber,  // optional for update
        String birthDate,    // optional for update
        MultipartFile picture // nullable for update
) {}
