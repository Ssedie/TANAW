package com.crud.tanaw.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.Date;

public class FeedbackDTO {


    @NotBlank(message = "Feedback is needed")
    private String content;
}
