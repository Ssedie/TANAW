package com.crud.tanaw.repositories;

import com.crud.tanaw.dto.dashboardDTO.*;
import com.crud.tanaw.entities.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DashboardRepository extends JpaRepository<Project, Integer> {

    @Query("SELECT new com.crud.tanaw.dto.dashboardDTO.UsersByStatusDTO(u.accountStatus, COUNT(u)) " +
            "FROM User u GROUP BY u.accountStatus")
    List<UsersByStatusDTO> countUsersByStatus();

    @Query("SELECT new com.crud.tanaw.dto.dashboardDTO.ProjectsByStatusDTO(p.projectStatus, COUNT(p)) " +
            "FROM Project p GROUP BY p.projectStatus")
    List<ProjectsByStatusDTO> countProjectsByStatus();

    @Query("SELECT new com.crud.tanaw.dto.dashboardDTO.ProjectFeedbackDTO(p.projectName, COUNT(f)) " +
            "FROM Project p LEFT JOIN p.feedbacks f GROUP BY p.projectName")
    List<ProjectFeedbackDTO> projectFeedbackCount();

    @Query("SELECT f FROM Feedback f LEFT JOIN FETCH f.reply WHERE f.project.projectId = :projectId")
    List<com.crud.tanaw.entities.Feedback> findFeedbacksWithRepliesByProject(Integer projectId);

    @Query("SELECT new com.crud.tanaw.dto.dashboardDTO.BudgetSummaryDTO(" +
            "d.documentTitle, " +
            "COALESCE(CAST(SUM(b.approvedBudget) AS double), 0.0), " +
            "COALESCE(CAST(SUM(b.totalExpenses) AS double), 0.0)) " +
            "FROM Budget b " +
            "JOIN b.document d " +
            "GROUP BY d.documentTitle")
    List<BudgetSummaryDTO> budgetSummary();



}
