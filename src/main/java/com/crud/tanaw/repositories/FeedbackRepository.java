package com.crud.tanaw.repositories;

import com.crud.tanaw.dto.dashboardDTO.FeedbackSummaryDTO;
import com.crud.tanaw.entities.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {
    boolean existsByFeedbackId(Integer feedbackId);
    List<Feedback> findByProjectProjectId(Integer projectId);
    List<Feedback> findByReplyReplyId(Integer replyId);

    @Query("SELECT new com.crud.tanaw.dto.dashboardDTO.FeedbackSummaryDTO(p.projectId, p.projectName, COUNT(f)) " +
            "FROM Feedback f JOIN f.project p GROUP BY p.projectId, p.projectName")
    List<FeedbackSummaryDTO> findFeedbackCountsByProject();

    @Query("SELECT f FROM Feedback f WHERE f.project.projectId = ?1 ORDER BY f.uploadDate DESC")
    List<Feedback> findByProjectIdOrderByUploadDateDesc(Integer projectId);

    @Query("SELECT COUNT(f) FROM Feedback f")
    Long totalFeedbackCount();
}
