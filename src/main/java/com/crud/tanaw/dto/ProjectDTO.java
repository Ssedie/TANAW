package com.crud.tanaw.dto;

import jakarta.validation.constraints.NotBlank;

public class ProjectDTO {

    Integer projectId;
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
    Integer documentId;

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAllocatedBudget() {
        return allocatedBudget;
    }

    public void setAllocatedBudget(String allocatedBudget) {
        this.allocatedBudget = allocatedBudget;
    }

    public String getProjectStatus() {
        return projectStatus;
    }

    public void setProjectStatus(String projectStatus) {
        this.projectStatus = projectStatus;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public Integer getProjectId() {
        return projectId;
    }

    public void setProjectId(Integer projectId) {
        this.projectId = projectId;
    }
    public Integer getDocumentId() {
        return documentId;
    }
    public void setDocumentId(Integer documentId) {
        this.documentId = documentId;
    }
}
