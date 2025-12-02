package com.crud.tanaw.entities;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "replies")
public class Reply {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer replyId;

    private String content;
    private Date replyDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id")
    private User user;
    @OneToMany(mappedBy = "reply")
    private List<Feedback> feedbacks = new ArrayList<>();

    public Integer getReplyId() { return replyId; }
    public void setReplyId(Integer replyId) { this.replyId = replyId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Date getReplyDate() { return replyDate; }
    public void setReplyDate(Date replyDate) { this.replyDate = replyDate; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public List<Feedback> getFeedbacks() { return feedbacks; }
    public void setFeedbacks(List<Feedback> feedbacks) { this.feedbacks = feedbacks; }
}
