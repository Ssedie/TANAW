package com.crud.tanaw.dto.ReqRep;

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
        Integer zipCode,
        String phoneNumber,
        String birthDate
) {}