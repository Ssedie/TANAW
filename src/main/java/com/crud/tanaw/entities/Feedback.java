package com.crud.tanaw.entities;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "feedbacks")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer feedbackId;

    private String content;

    @Temporal(TemporalType.TIMESTAMP)
    private Date uploadDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="reply_id")
    private Reply reply;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="project_id")
    private Project project;

    // --- Getters & Setters ---
    public Integer getFeedbackId() { return feedbackId; }
    public void setFeedbackId(Integer feedbackId) { this.feedbackId = feedbackId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Date getUploadDate() { return uploadDate; }
    public void setUploadDate(Date uploadDate) { this.uploadDate = uploadDate; }

    public Reply getReply() { return reply; }
    public void setReply(Reply reply) { this.reply = reply; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }
}
