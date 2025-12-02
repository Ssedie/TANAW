package com.crud.tanaw.dto;

import com.crud.tanaw.entities.User;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Date;

public class UserDTO {


    @NotBlank(message = "Please input your name")
    private String fName;
    @NotBlank(message = "Please input your middle name")
    private String mName;
    @NotBlank(message = "Please input your last name")
    private String lName;

    @NotBlank(message = "Please input the street that you live in")
    private String street;
    @NotBlank(message = "Please input the barangay that you live in")
    private String barangay;
    @NotBlank(message = "Please input the city/municipality that you live in")
    private String city;
    @NotBlank(message = "Please input the province that you live in")
    private String province;
    @NotBlank(message = "Please input the region that you live in")
    private String region;
    @NotBlank(message = "Please input the country that you live in")
    private String country;
    @NotBlank(message = "Please input the zip code of where you live")
    @Max(4)
    private int zipCode;
    @NotBlank(message = "Please provide an email.")
    private String email;
    @NotBlank(message = "Please provide a suitable password")
    private String password;

    @NotBlank(message = "Please choose your role")
    private String role;
    @NotBlank(message = "Please put your phone number")
    private String phoneNumber;
    @NotBlank(message = "Please input the day the day that you were born")
    private Date birthDate;
}
