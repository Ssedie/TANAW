package com.crud.tanaw.dto;

import com.crud.tanaw.entities.User;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Date;

public class UserDTO {


    @NotBlank(message = "Please input your name")
    private String f_name;
    @NotBlank(message = "Please input your middle name")
    private String m_name;
    @NotBlank(message = "Please input your last name")
    private String l_name;

    @NotBlank(message = "Please input the street that you live in")
    private String street;
    @NotBlank(message = "Please input the city/municipality that you live in")
    private String city;
    @NotBlank(message = "Please input the region that you live in")
    private String region;
    @NotBlank(message = "Please input the country that you live in")
    private String country;
    @NotBlank(message = "Please input the zip code of where you live")
    @Max(4)
    private int zip_code;

    @NotBlank(message = "Please provide an email.")
    private String email;
    @NotBlank(message = "Please provide a suitable password")
    private String password;

    @NotBlank(message = "Please choose your role")
    private String role;
    @NotBlank(message = "Please put your phone number")
    private String phone_number;
    @NotBlank(message = "Please input the day the day that you were born")
    private Date birth_date;

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

    public int getZip_code() {
        return zip_code;
    }

    public void setZip_code(int zip_code) {
        this.zip_code = zip_code;
    }
}
