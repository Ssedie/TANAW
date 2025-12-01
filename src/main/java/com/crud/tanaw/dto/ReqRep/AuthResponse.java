package com.crud.tanaw.dto.ReqRep;

public record AuthResponse(String token, int user_id, Long expires_at) {
}
