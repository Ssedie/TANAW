package com.crud.tanaw.services;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class PasswordResetService {

    private final Map<Long, String> resetTokens = new HashMap<>();

    public String createResetToken(Long userId) {
        String token = UUID.randomUUID().toString().substring(0, 6); // 6-char token
        resetTokens.put(userId, token);
        return token;
    }

    public boolean validateToken(Long userId, String token) {
        return resetTokens.containsKey(userId) && resetTokens.get(userId).equals(token);
    }

    public void clearToken(Long userId) {
        resetTokens.remove(userId);
    }
}

