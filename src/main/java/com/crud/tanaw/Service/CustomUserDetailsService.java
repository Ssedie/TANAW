package com.crud.tanaw.Service;

import com.crud.tanaw.Repositories.UserRepository;
import com.crud.tanaw.entities.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService  implements UserDetailsService {
    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        int userId;
        try {
            userId = Integer.parseInt(username);
        } catch (NumberFormatException e) {
            throw new UsernameNotFoundException("Invalid user_id format");
        }

        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return org.springframework.security.core.userdetails.User
                .withUsername(String.valueOf(user.getUserId())) // must be String
                .password(user.getPassword())
                .authorities(Collections.emptyList()) // or roles if you have them
                .build();

    }
}
