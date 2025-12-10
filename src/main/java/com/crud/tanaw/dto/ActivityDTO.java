package com.crud.tanaw.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ActivityDTO {

    private Integer activityId;

    @NotBlank(message = "Activity name must be filled out.")
    private String activityName;

    @NotBlank(message = "Please provide a valid description for the activity.")
    private String description;

    @NotBlank(message = "Please provide a date for the activity.")
    private String date;

    @NotBlank(message = "Please provide a valid status for the activity.")
    private String status;

    @NotBlank(message = "Please provide the exact expense for the activity.")
    private Double expenses;

    @NotNull(message = "Project ID must not be empty.")
    private Integer projectId;

    @NotBlank(message = "Project name must not be empty.")
    private String projectName;

    public ActivityDTO() {}

    public ActivityDTO(Integer activityId, String activityName, String description, java.util.Date date,
                       String status, Double expenses, Integer projectId) {
        this.activityId = activityId;
        this.activityName = activityName;
        this.description = description;
        this.date = date != null ? date.toString() : null; // convert Date to String
        this.status = status;
        this.expenses = expenses;
        this.projectId = projectId;
    }

    public Integer getActivityId() {
        return activityId;
    }

    public void setActivityId(Integer activityId) {
        this.activityId = activityId;
    }

    public String getActivityName() {
        return activityName;
    }

    public void setActivityName(String activityName) {
        this.activityName = activityName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getExpenses() {
        return expenses;
    }

    public void setExpenses(Double expenses) {
        this.expenses = expenses;
    }

    public Integer getProjectId() {
        return projectId;
    }

    public void setProjectId(Integer projectId) {
        this.projectId = projectId;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }
}
