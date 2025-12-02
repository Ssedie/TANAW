package com.crud.tanaw.dto.ReqRep;

public record AuthResponse(String token, Integer userId, Long expiresAt, String role) {
}
