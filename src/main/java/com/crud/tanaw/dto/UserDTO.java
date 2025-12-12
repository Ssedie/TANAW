package com.crud.tanaw.dto;

import com.crud.tanaw.entities.User;
import jakarta.validation.constraints.*;
import org.springframework.cglib.core.Local;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Date;

public class UserDTO {

    private Integer userId;

    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name must not exceed 50 characters")
    private String fName;

    @Size(max = 50, message = "Middle name must not exceed 50 characters")
    private String mName;

    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name must not exceed 50 characters")
    private String lName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email format is invalid")
    private String email;

    @NotBlank(message = "Role is required")
    private String role;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10,15}$", message = "Phone number must be 10–15 digits")
    private String phoneNumber;

    @NotBlank(message = "Street is required")
    private String street;

    @NotBlank(message = "Barangay is required")
    private String barangay;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "Province is required")
    private String province;

    @NotBlank(message = "Region is required")
    private String region;

    @NotBlank(message = "Country is required")
    private String country;

    @NotNull(message = "Zip code is required")
    @Min(value = 100, message = "Zip code must be at least 3 digits")
    @Max(value = 9999, message = "Zip code must not exceed 4 digits")
    private Integer zipCode;

    private String birthDate;

    private String accountStatus;

    private String picturePath;

    public UserDTO(Integer userId, String fName, String mName, String lName, String email,
                   String role, String phoneNumber, String street, String barangay,
                   String city, String province, String region, String country,
                   Integer zipCode, String birthDate, String picturePath, String accountStatus) {
        this.userId = userId;
        this.fName = fName;
        this.mName = mName;
        this.lName = lName;
        this.email = email;
        this.role = role;
        this.phoneNumber = phoneNumber;
        this.street = street;
        this.barangay = barangay;
        this.city = city;
        this.province = province;
        this.region = region;
        this.country = country;
        this.zipCode = zipCode;
        this.birthDate = birthDate;
        this.picturePath = picturePath;
        this.accountStatus = accountStatus;
    }


    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getFName() {
        return fName;
    }

    public void setFName(String fName) {
        this.fName = fName;
    }

    public String getMName() {
        return mName;
    }

    public void setMName(String mName) {
        this.mName = mName;
    }

    public String getLName() {
        return lName;
    }

    public void setLName(String lName) {
        this.lName = lName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getBarangay() {
        return barangay;
    }

    public void setBarangay(String barangay) {
        this.barangay = barangay;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public Integer getZipCode() {
        return zipCode;
    }

    public void setZipCode(Integer zipCode) {
        this.zipCode = zipCode;
    }

    public String getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(String birthDate) {
        this.birthDate = birthDate;
    }

    public String getPicturePath() {
        return picturePath;
    }

    public void setPicture(String picturePath) {
        this.picturePath = picturePath;
    }

    public String getAccountStatus() {
        return accountStatus;
    }

    public void setAccountStatus(String accountStatus) {
        this.accountStatus = accountStatus;
    }
}
