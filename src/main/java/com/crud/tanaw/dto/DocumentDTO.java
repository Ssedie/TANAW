package com.crud.tanaw.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Date;

public class DocumentDTO {

    @NotBlank(message = "Please make sure that the document has a type.")
    private String document_type;
    @NotBlank(message = "Please provide the title of the document.")
    private String document_title;
    @NotBlank(message = "Please provide the actual date of upload.")
    private Date upload_date;
}
