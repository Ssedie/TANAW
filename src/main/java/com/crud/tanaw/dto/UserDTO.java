package com.crud.tanaw.dto;

import com.crud.tanaw.entities.User;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Date;

public class UserDTO {

    private Integer userId;
    private String fName;
    private String mName;
    private String lName;
    private String email;
    private String role;
    private String phoneNumber;
    private String street;
    private String barangay;
    private String city;
    private String province;
    private String region;
    private String country;
    private Integer zipCode;      // String to keep leading zeros
    private Date birthDate;

    public UserDTO(Integer userId, String fName, String mName, String lName, String email,
                   String role, String phoneNumber, String street, String barangay,
                   String city, String province, String region, String country,
                   Integer zipCode, Date birthDate) {
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
    }


    public Integer getId() {
        return userId;
    }

    public void setId(Integer userId) {
        this.userId = userId;
    }

    public String getfName() {
        return fName;
    }

    public void setfName(String fName) {
        this.fName = fName;
    }

    public String getmName() {
        return mName;
    }

    public void setmName(String mName) {
        this.mName = mName;
    }

    public String getlName() {
        return lName;
    }

    public void setlName(String lName) {
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

    public Date getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(Date birthDate) {
        this.birthDate = birthDate;
    }
}
