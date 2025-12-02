package com.crud.tanaw.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer projectId;

    private String projectName;
    private String description;

    @Temporal(TemporalType.DATE)
    private Date startDate;

    @Temporal(TemporalType.DATE)
    private Date endDate;

    private String allocatedBudget;
    private String projectStatus;
    private String feedback;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name= "document_id")
    @JsonBackReference
    private Document document;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id")
    @JsonBackReference
    private User user;

    @OneToMany(mappedBy = "project")
    @JsonManagedReference
    private List<Feedback> feedbacks = new ArrayList<>();

    // --- Getters & Setters ---
    public Integer getProjectId() { return projectId; }
    public void setProjectId(Integer projectId) { this.projectId = projectId; }

    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Date getStartDate() { return startDate; }
    public void setStartDate(Date startDate) { this.startDate = startDate; }

    public Date getEndDate() { return endDate; }
    public void setEndDate(Date endDate) { this.endDate = endDate; }

    public String getAllocatedBudget() { return allocatedBudget; }
    public void setAllocatedBudget(String allocatedBudget) { this.allocatedBudget = allocatedBudget; }

    public String getProjectStatus() { return projectStatus; }
    public void setProjectStatus(String projectStatus) { this.projectStatus = projectStatus; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public Document getDocument() { return document; }
    public void setDocument(Document document) { this.document = document; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public List<Feedback> getFeedbacks() { return feedbacks; }
    public void setFeedbacks(List<Feedback> feedbacks) { this.feedbacks = feedbacks; }
}
