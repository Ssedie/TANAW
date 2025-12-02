package com.crud.tanaw.services;

import com.crud.tanaw.dto.ReqRep.UpdateProfileRequest;
import com.crud.tanaw.entities.User;
import com.crud.tanaw.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final Random random = new Random();

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User registerUser(
            String email,
            String password,
            String role,
            String fName,
            String mName,
            String lName,
            String phoneNumber,
            String birthDate,
            String street,
            String barangay,
            String city,
            String province,
            String region,
            String country,
            Integer zipCode
    ) {
        User user = new User();

        // --- Generate 6-digit ID ---
        int generatedId = (int) (Math.random() * 900000) + 100000;
        user.setUserId(generatedId);

        // --- Main fields ---
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);

        // --- Profile fields ---
        user.setFName(fName);
        user.setMName(mName);
        user.setLName(lName);
        user.setPhoneNumber(phoneNumber);

        // convert birthDate string → Date
        try {
            if (birthDate != null && !birthDate.isEmpty()) {
                user.setBirthDate(new SimpleDateFormat("yyyy-MM-dd").parse(birthDate));
            }
        } catch (Exception e) {
            throw new RuntimeException("Invalid birth date format (expected yyyy-MM-dd)");
        }

        user.setStreet(street);
        user.setBarangay(barangay);
        user.setCity(city);
        user.setProvince(province);
        user.setRegion(region);
        user.setCountry(country);
        user.setZipCode(zipCode != null ? zipCode : 0);

        // --- System fields ---
        user.setAccountStatus("ACTIVE");
        user.setDateCreated(new Date());

        return userRepository.save(user);
    }

    private Integer generateUniqueUserId() {
        int id;
        do {
            id = 100000 + random.nextInt(900000); // generates 100000-999999
        } while (userRepository.existsById(id)); // ensure uniqueness
        return id;
    }

    public User findByUserId(Long userId) {
        return userRepository.findById(Math.toIntExact(userId))
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public User updateUserProfile(Long userId, UpdateProfileRequest request) {
        User user = findByUserId(userId);

        if (request.fName() != null) user.setFName(request.fName());
        if (request.mName() != null) user.setMName(request.mName());
        if (request.lName() != null) user.setLName(request.lName());
        if (request.street() != null) user.setStreet(request.street());
        if (request.city() != null) user.setCity(request.city());
        if (request.barangay() != null) user.setBarangay(request.barangay());
        if (request.province() != null) user.setCountry(request.province());
        if (request.region() != null) user.setRegion(request.region());
        if (request.country() != null) user.setCountry(request.country());
        if (request.zipCode() != null) user.setZipCode(request.zipCode());
        if (request.phoneNumber() != null) user.setPhoneNumber(request.phoneNumber());

        // Handle birthDate conversion if needed

        return userRepository.save(user);
    }
}

