package com.crud.tanaw.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.Date;

public class ReplyDTO {

    @NotBlank(message ="Please provide a proper reply.")
    private String content;
    @NotBlank(message ="")
    private Date replyDate;
}
