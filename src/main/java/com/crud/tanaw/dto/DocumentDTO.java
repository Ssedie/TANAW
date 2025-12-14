package com.crud.tanaw.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Date;

public class DocumentDTO {

    Integer documentId;
    @NotBlank(message = "Please make sure that the document has a type.")
    private String documentType;
    @NotBlank(message = "Please provide the title of the document.")
    private String documentTitle;
    Double totalBudget;
    @NotBlank(message = "Please provide the actual date of upload.")
    private Date uploadDate;
}
