package com.crud.tanaw.dto.dashboardDTO;

public class DashboardOverviewDTO {
    private Double totalBudget;
    private Double totalSpent;
    private Long activeProjects;
    private Long onTimeProjects;
    private Long delayedProjects;
    private Long feedbackCount;

    // constructors
    public DashboardOverviewDTO() {}
    public DashboardOverviewDTO(Double totalBudget, Double totalSpent, Long activeProjects,
                                Long onTimeProjects, Long delayedProjects, Long feedbackCount) {
        this.totalBudget = totalBudget;
        this.totalSpent = totalSpent;
        this.activeProjects = activeProjects;
        this.onTimeProjects = onTimeProjects;
        this.delayedProjects = delayedProjects;
        this.feedbackCount = feedbackCount;
    }

    // getters & setters
    // ... (generate)
    public Double getTotalBudget() { return totalBudget; }
    public void setTotalBudget(Double totalBudget) { this.totalBudget = totalBudget; }
    public Double getTotalSpent() { return totalSpent; }
    public void setTotalSpent(Double totalSpent) { this.totalSpent = totalSpent; }
    public Long getActiveProjects() { return activeProjects; }
    public void setActiveProjects(Long activeProjects) { this.activeProjects = activeProjects; }
    public Long getOnTimeProjects() { return onTimeProjects; }
    public void setOnTimeProjects(Long onTimeProjects) { this.onTimeProjects = onTimeProjects; }
    public Long getDelayedProjects() { return delayedProjects; }
    public void setDelayedProjects(Long delayedProjects) { this.delayedProjects = delayedProjects; }
    public Long getFeedbackCount() { return feedbackCount; }
    public void setFeedbackCount(Long feedbackCount) { this.feedbackCount = feedbackCount; }
}
