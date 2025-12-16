package com.crud.tanaw.dto.ReqRep;

public class ForgetPasswordRequest {
    private Long userId;
    private String email;
    private String birthDate;

    // Getters and setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getBirthDate() { return birthDate; }
    public void setBirthDate(String birthDate) { this.birthDate = birthDate; }
}
