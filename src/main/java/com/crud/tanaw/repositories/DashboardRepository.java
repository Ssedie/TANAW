package com.crud.tanaw.repositories;

import com.crud.tanaw.dto.ActivityDTO;
import com.crud.tanaw.dto.dashboardDTO.*;
import com.crud.tanaw.entities.Budget;
import com.crud.tanaw.entities.Feedback;
import com.crud.tanaw.entities.Project;
import com.crud.tanaw.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DashboardRepository extends JpaRepository<Project, Integer> {

    // --- Users by status ---
    @Query("SELECT new com.crud.tanaw.dto.dashboardDTO.UsersByStatusDTO(u.accountStatus, COUNT(u)) " +
            "FROM User u GROUP BY u.accountStatus")
    List<UsersByStatusDTO> countUsersByStatus();

    // --- Sum approved budget ---
    @Query("SELECT COALESCE(SUM(b.totalBudget), 0) FROM Budget b")
    Double sumApprovedBudget();

    // --- Sum total expenses ---
    @Query("SELECT COALESCE(SUM(b.totalExpenses), 0) FROM Budget b")
    Double sumTotalExpenses();

    @Query("SELECT COALESCE(SUM(b.totalBudget), 0) FROM Budget b WHERE b.fiscalYear = ?1")
    Double sumApprovedBudgetByFiscalYear(String fiscalYear);

    @Query("SELECT COALESCE(SUM(b.totalExpenses), 0) FROM Budget b WHERE b.fiscalYear = ?1")
    Double sumTotalExpensesByFiscalYear(String fiscalYear);

    @Query("SELECT d.documentType as documentType, SUM(b.totalBudget) as totalBudget FROM Budget b JOIN b.document d WHERE b.fiscalYear = ?1 GROUP BY d.documentType")
    List<Object[]> findBudgetDistributionByDocumentTypeAndFiscalYear(String fiscalYear);

    @Query("SELECT DISTINCT b.fiscalYear FROM Budget b ORDER BY b.fiscalYear DESC")
    List<String> findDistinctFiscalYears();

    // --- Budget distribution by document type / sector ---
    @Query("SELECT new com.crud.tanaw.dto.dashboardDTO.BudgetDistributionDTO(" +
            "b.document.documentType, CAST(SUM(COALESCE(b.totalBudget,0))AS DOUBLE))  " +
            "FROM Budget b " +
            "GROUP BY b.document.documentType")
    List<BudgetDistributionDTO> findBudgetDistributionByDocumentType();

    // --- Project status table ---
    @Query("SELECT new com.crud.tanaw.dto.dashboardDTO.ProjectStatusDTO(" +
            "p.projectId, " +
            "p.projectName, " +
            "COALESCE(p.allocatedBudget, 0), " +
            "(SELECT COALESCE(SUM(a.expenses), 0) FROM Activity a WHERE a.project.projectId = p.projectId), " +
            "p.projectStatus, " +
            "p.endDate) " +
            "FROM Project p")
    List<ProjectStatusDTO> findAllProjectStatus();

    // --- Feedback summary per project ---
    @Query("SELECT new com.crud.tanaw.dto.dashboardDTO.FeedbackSummaryDTO(" +
            "p.projectId, p.projectName, COUNT(f)) " +
            "FROM Project p LEFT JOIN p.feedbacks f " +
            "GROUP BY p.projectId, p.projectName")
    List<FeedbackSummaryDTO> findFeedbackSummary();

    @Query("SELECT COUNT(f) FROM Feedback f")
    Long countAllFeedbacks();

    // --- Detailed feedbacks for a specific project with replies ---
    @Query("SELECT new com.crud.tanaw.dto.dashboardDTO.FeedbackWithRepliesDTO(f.content, r.content) " +
            "FROM Feedback f LEFT JOIN f.reply r " +
            "WHERE f.project.projectId = :projectId")
    List<FeedbackWithRepliesDTO> findFeedbacksWithRepliesByProject(Integer projectId);

    // --- Optional: recent activities (if you implement ActivityDTO) ---
    @Query("SELECT new com.crud.tanaw.dto.ActivityDTO(" +
            "a.activityId, a.activityName, a.description, a.date, a.status, a.expenses, " +
            "p.projectId, p.projectName, a.type) " +
            "FROM Activity a " +
            "LEFT JOIN a.project p " +
            "ORDER BY a.date DESC")
    List<ActivityDTO> findRecentActivities();

}
