package com.crud.tanaw.services;

import com.crud.tanaw.dto.ReqRep.UpdateProfileRequest;
import com.crud.tanaw.entities.User;
import com.crud.tanaw.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
    public User registerUser(String email, String password, String role) {
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setUserId(generateUniqueUserId());
        user.setRole(role);// <-- generate 6-digit ID

        // set other default values if needed
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
        if (request.region() != null) user.setRegion(request.region());
        if (request.country() != null) user.setCountry(request.country());
        if (request.zipCode() != null) user.setZipCode(request.zipCode());
        if (request.phoneNumber() != null) user.setPhoneNumber(request.phoneNumber());

        // Handle birthDate conversion if needed

        return userRepository.save(user);
    }
}

