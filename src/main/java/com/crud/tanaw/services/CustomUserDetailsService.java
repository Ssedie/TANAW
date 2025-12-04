package com.crud.tanaw.services;

import com.crud.tanaw.entities.User;
import com.crud.tanaw.repositories.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String usernameOrId) throws UsernameNotFoundException {
        User user;

        // Try parsing as an ID first
        try {
            int userId = Integer.parseInt(usernameOrId);
            user = userRepository.findById(userId)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        } catch (NumberFormatException e) {
            // Not a number, fallback to email
            user = userRepository.findByEmail(usernameOrId)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        }

        return new CustomUserDetails(
                user.getUserId(),
                user.getEmail(),
                user.getPassword(),
                Collections.emptyList()
        );
    }

}

