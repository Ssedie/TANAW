package com.crud.tanaw.dto;

import jakarta.validation.constraints.NotBlank;

public class ProjectDTO {

    @NotBlank(message = "Please provide the name of the project.")
    private String projectName;
    @NotBlank(message = "Please provide a description of the project.")
    private String description;
    @NotBlank(message = "Please provide the actual budget allocated for the project.")
    private String allocatedBudget;
    @NotBlank(message = "Please set the project status correctly.")
    private String projectStatus;
    @NotBlank(message = "Please provide some feedback for the project.")
    private String feedback;
}
