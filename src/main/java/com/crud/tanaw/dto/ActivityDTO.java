package com.crud.tanaw.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.Date;

public class ActivityDTO {

    @NotBlank(message="Activity name must be filled out.")
    private String activity_name;
    @NotBlank(message="Please put a valid description for the activity to be recorded.")
    private String description;
    @NotBlank(message= "Please provide a valid status for the project/activity.")
    private String status;
    @NotBlank(message="Input the exact expense to be recorded.")
    private String expenses;
}
