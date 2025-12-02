package com.crud.tanaw.repositories;

import com.crud.tanaw.entities.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {
    boolean existsByFeedbackId(Integer feedbackId);
    List<Feedback> findByProjectProjectId(Integer projectId);
    List<Feedback> findByReplyReplyId(Integer replyId);
}
