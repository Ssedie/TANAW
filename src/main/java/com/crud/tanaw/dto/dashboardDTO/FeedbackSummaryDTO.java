package com.crud.tanaw.dto.dashboardDTO;

public class FeedbackSummaryDTO {
    private Integer projectId;
    private String projectName;
    private Long feedbackCount;

    public FeedbackSummaryDTO() {
    }

    public FeedbackSummaryDTO(Integer projectId, String projectName, Long feedbackCount) {
        this.projectId = projectId;
        this.projectName = projectName;
        this.feedbackCount = feedbackCount;
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

    public Long getFeedbackCount() {
        return feedbackCount;
    }

    public void setFeedbackCount(Long feedbackCount) {
        this.feedbackCount = feedbackCount;
    }
}
