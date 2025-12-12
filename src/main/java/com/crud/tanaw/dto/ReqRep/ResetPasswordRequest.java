package com.crud.tanaw.dto.ReqRep;

public class ResetPasswordRequest {
    private String token;
    private Long userId;
    private String password;

    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
