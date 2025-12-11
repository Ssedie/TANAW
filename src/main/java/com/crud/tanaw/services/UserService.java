package com.crud.tanaw.services;

import com.crud.tanaw.dto.ReqRep.UpdateProfileRequest;
import com.crud.tanaw.entities.User;
import com.crud.tanaw.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Date;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final Random random = new Random();

    @Value("${app.upload-dir:uploads/users}")
    private String uploadDir; // default folder if not set in application.properties

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // =========================
    // Register new user
    // =========================
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

        // --- Generate unique 6-digit ID ---
        user.setUserId(generateUniqueUserId());

        // --- Main fields ---
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);

        // --- Profile fields ---
        user.setFName(fName);
        user.setMName(mName);
        user.setLName(lName);
        user.setPhoneNumber(phoneNumber);

        if (birthDate != null && !birthDate.isEmpty()) {
            try {
                user.setBirthDate(LocalDate.parse(birthDate)); // expects "yyyy-MM-dd"
            } catch (Exception e) {
                throw new RuntimeException("Invalid birth date format (expected yyyy-MM-dd)");
            }
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

        User savedUser = userRepository.save(user);
        System.out.println("Registered user with ID: " + savedUser.getUserId());
        return savedUser;
    }

    // =========================
    // Safe find by email
    // =========================
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // =========================
    // Safe find by userId
    // =========================
    public Optional<User> findByUserId(Long userId) {
        if (userId == null) return Optional.empty();
        System.out.println("Looking for user with ID: " + userId);
        return userRepository.findById(Math.toIntExact(userId));
    }

    // =========================
    // Generate unique 6-digit user ID
    // =========================
    private Integer generateUniqueUserId() {
        int id;
        do {
            id = 100000 + random.nextInt(900000); // generates 100000-999999
        } while (userRepository.existsById(id));
        return id;
    }

    // =========================
    // Update user profile
    // =========================
    @Transactional
    public User updateUserProfile(Long userId, UpdateProfileRequest request) {
        User user = findByUserId(userId).orElseThrow(() -> new RuntimeException("User not found"));

        // --- Update basic profile ---
        if (request.fName() != null) user.setFName(request.fName());
        if (request.mName() != null) user.setMName(request.mName());
        if (request.lName() != null) user.setLName(request.lName());
        if (request.street() != null) user.setStreet(request.street());
        if (request.barangay() != null) user.setBarangay(request.barangay());
        if (request.city() != null) user.setCity(request.city());
        if (request.province() != null) user.setProvince(request.province());
        if (request.region() != null) user.setRegion(request.region());
        if (request.country() != null) user.setCountry(request.country());
        if (request.zipCode() != null) user.setZipCode(request.zipCode());
        if (request.phoneNumber() != null) user.setPhoneNumber(request.phoneNumber());
        if (request.birthDate() != null) user.setBirthDate(request.birthDate());

        // Optional fields
        if (request.email() != null) user.setEmail(request.email());
        if (request.password() != null) user.setPassword(passwordEncoder.encode(request.password()));
        if (request.role() != null) user.setRole(request.role());

        // --- Handle profile picture ---
        MultipartFile picture = request.picture();
        if (picture != null && !picture.isEmpty()) {

            String contentType = picture.getContentType();
            if (!Arrays.asList("image/jpeg", "image/jpg", "image/png", "image/gif").contains(contentType)) {
                throw new RuntimeException("Invalid file type");
            }
            if (picture.getSize() > 5 * 1024 * 1024) {
                throw new RuntimeException("File size exceeds 5MB");
            }

            // Ensure upload directory exists
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            try {
                Files.createDirectories(uploadPath);
            } catch (IOException e) {
                throw new RuntimeException("Could not create upload directory: " + e.getMessage());
            }

            // Save file with unique name
            String fileName = UUID.randomUUID() + "_" + StringUtils.cleanPath(picture.getOriginalFilename());
            Path filePath = uploadPath.resolve(fileName);

            try {
                Files.copy(picture.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                user.setPicturePath(uploadDir + "/" + fileName);
                System.out.println("Saved profile picture: " + fileName);
            } catch (IOException e) {
                throw new RuntimeException("Could not save file: " + e.getMessage());
            }
        }

        User updated = userRepository.save(user);
        System.out.println("Updated user ID: " + updated.getUserId());
        return updated;
    }
}