package com.crud.tanaw.dto.dashboardDTO;

import java.time.LocalDate;
import java.util.Date;

public class ProjectStatusDTO {
    private Integer projectId;
    private String projectName;
    private Double allocatedBudget;
    private Double spentBudget;
    private Double progress; // 0-100
    private String status;
    private Double remainingBudget;
    private Date dueDate;

    public ProjectStatusDTO() {}

    // This constructor exactly matches the JPQL query
    public ProjectStatusDTO(Integer projectId, String projectName,
                            Double allocatedBudget, Double spentBudget,
                            String status, Double remainingBudget,Date dueDate) {
        this.projectId = projectId;
        this.projectName = projectName;
        this.allocatedBudget = allocatedBudget;
        this.spentBudget = spentBudget;
        this.status = status;
        this.remainingBudget = remainingBudget;
        this.dueDate = dueDate;
        this.progress = 0.0; // calculate in controller
    }

    // getters & setters
    public Integer getProjectId() { return projectId; }
    public void setProjectId(Integer projectId) { this.projectId = projectId; }
    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }
    public Double getAllocatedBudget() { return allocatedBudget; }
    public void setAllocatedBudget(Double allocatedBudget) { this.allocatedBudget = allocatedBudget; }
    public Double getSpentBudget() { return spentBudget; }
    public void setSpentBudget(Double spentBudget) { this.spentBudget = spentBudget; }
    public Double getProgress() { return progress; }
    public void setProgress(Double progress) { this.progress = progress; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Date getDueDate() { return dueDate; }
    public void setDueDate(Date dueDate) { this.dueDate = dueDate; }

    public Double getRemainingBudget() {
        return remainingBudget;
    }

    public void setRemainingBudget(Double remainingBudget) {
        this.remainingBudget = remainingBudget;
    }
}
