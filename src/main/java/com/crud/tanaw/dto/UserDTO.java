package com.crud.tanaw.dto;

import com.crud.tanaw.entities.User;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.Date;

public class UserDTO {


    @NotNull
    private String f_name;
    @NotNull
    private String m_name;
    @NotNull
    private String l_name;

    @NotNull
    private String street;
    @NotNull
    private String city;
    @NotNull
    private String region;
    @NotNull
    private String country;
    @NotNull
    @Max(4)
    private int zip_code;

    @NotNull
    private String email;
    @NotNull
    private String password;

    @NotNull
    private String role;
    @NotNull
    private String phone_number;
    @NotNull
    private Date birth_date;
    @NotNull
    private String account_status;
    @NotNull
    private Date date_created;

    public String getfName() {
        return f_name;
    }

    public void setfName(String f_name) {
        this.f_name = f_name;
    }

    public String getmName() {
        return m_name;
    }

    public void setmName(String m_name) {
        this.m_name = m_name;
    }

    public String getlName() {
        return l_name;
    }

    public void setlName(String l_name) {
        this.l_name = l_name;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getPhoneNumber() {
        return phone_number;
    }

    public void setPhoneNumber(String phone_number) {
        this.phone_number = phone_number;
    }

    public Date getBirthDate() {
        return birth_date;
    }

    public void setBirthDate(Date birth_date) {
        this.birth_date = birth_date;
    }

    public String getAccountStatus() {
        return account_status;
    }

    public void setAccountStatus(String account_status) {
        this.account_status = account_status;
    }

    public Date getDateCreated() {
        return date_created;
    }

    public void setDateCreated(Date date_created) {
        this.date_created = date_created;
    }

    public int getZip_code() {
        return zip_code;
    }

    public void setZip_code(int zip_code) {
        this.zip_code = zip_code;
    }
}
