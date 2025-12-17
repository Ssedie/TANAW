package com.crud.tanaw.repositories;

import com.crud.tanaw.dto.ReqRep.BudgetSummaryDTO;
import com.crud.tanaw.entities.Document;
import com.crud.tanaw.entities.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Integer> {
    boolean existsByProjectId(Integer projectId);
    List<Project> findByUserUserId(Integer userId);

    Long countByProjectStatus(String status);

    List<Project> findByDocument(Document document);

    // ===== NEW METHODS REQUIRED FOR FISCAL YEAR FILTERING =====

    // Method 1: Find projects by fiscal year (through Budget relationship)
    @Query("SELECT p FROM Project p WHERE p.budget.fiscalYear = :fiscalYear")
    List<Project> findByBudget_FiscalYear(@Param("fiscalYear") String fiscalYear);

    @Query("SELECT COUNT(p) FROM Project p WHERE p.endDate >= ?1")
    Long countOnTime(Date today);

    @Query("SELECT COUNT(p) FROM Project p WHERE p.endDate < ?1")
    Long countDelayed(Date today);

    // Count on-time projects by fiscal year
    @Query("SELECT COUNT(p) FROM Project p WHERE p.budget.fiscalYear = :fiscalYear AND p.endDate >= :today")
    Long countOnTimeByFiscalYear(@Param("fiscalYear") String fiscalYear, @Param("today") Date today);

    // Count delayed projects by fiscal year
    @Query("SELECT COUNT(p) FROM Project p WHERE p.budget.fiscalYear = :fiscalYear AND p.endDate < :today AND p.projectStatus != 'COMPLETED'")
    Long countDelayedByFiscalYear(@Param("fiscalYear") String fiscalYear, @Param("today") Date today);

    @Query(
            "SELECT new com.crud.tanaw.dto.ReqRep.BudgetSummaryDTO(" +
                    "p.budget.fiscalYear, " +
                    "CAST(COALESCE(SUM(p.allocatedBudget), 0.0) AS DOUBLE), " +
                    "COALESCE(SUM(a.expenses), 0.0), " +
                    "(COALESCE(SUM(p.allocatedBudget), 0.0) - COALESCE(SUM(a.expenses), 0.0))" +
                    ") " +
                    "FROM Project p " +
                    "LEFT JOIN p.activities a " +
                    "GROUP BY p.budget.fiscalYear " +
                    "ORDER BY p.budget.fiscalYear ASC"
    )
    List<BudgetSummaryDTO> getBudgetSummaryAllYears();

    @Query("""
    SELECT 
        COALESCE(p.projectType, 'GENERAL'),
        COALESCE(SUM(a.expenses), 0)
    FROM Project p
    LEFT JOIN p.activities a
    WHERE p.budget.fiscalYear = :fiscalYear
    GROUP BY p.projectType
    ORDER BY COALESCE(SUM(a.expenses), 0) DESC
""")
    List<Object[]> sumSpendingByProjectType(@Param("fiscalYear") String fiscalYear);

    // Query to sum allocated budget for a specific document
    @Query("SELECT COALESCE(SUM(p.allocatedBudget), 0) FROM Project p WHERE p.document.documentId = ?1")
    Double sumAllocatedBudgetByDocumentId(Integer documentId);

    @Query("SELECT p FROM Project p WHERE p.budget.fiscalYear = ?1 ORDER BY p.projectId DESC")
    List<Project> findByFiscalYear(String fiscalYear);

    @Query("SELECT p FROM Project p WHERE p.budget.budgetId = ?1")
    List<Project> findByBudgetId(Integer budgetId);

    @Query("SELECT COUNT(p) FROM Project p WHERE p.budget.fiscalYear = ?1")
    Long countByFiscalYear(String fiscalYear);

    @Query("SELECT COALESCE(SUM(p.allocatedBudget), 0) FROM Project p WHERE p.budget.budgetId = ?1")
    Double sumAllocatedBudgetByBudgetId(Integer budgetId);

    @Query("SELECT DISTINCT p.budget.fiscalYear FROM Project p ORDER BY p.budget.fiscalYear DESC")
    List<String> findDistinctFiscalYears();

    // Method 3: Get total allocated budget for a fiscal year
    @Query("SELECT COALESCE(SUM(p.allocatedBudget), 0) FROM Project p WHERE p.budget.fiscalYear = :fiscalYear")
    Double sumAllocatedBudgetByFiscalYear(@Param("fiscalYear") String fiscalYear);

    // Method 4: Get total spent for a fiscal year (through activities)
    @Query("SELECT COALESCE(SUM(a.expenses), 0) FROM Activity a " +
            "WHERE a.project.budget.fiscalYear = :fiscalYear")
    Double sumExpensesByFiscalYear(@Param("fiscalYear") String fiscalYear);

    // Method 5: Count active projects by fiscal year
    @Query("SELECT COUNT(p) FROM Project p " +
            "WHERE p.budget.fiscalYear = :fiscalYear " +
            "AND p.projectStatus IN ('ONGOING', 'PENDING')")
    Long countActiveProjectsByFiscalYear(@Param("fiscalYear") String fiscalYear);

    // Method 6: Get projects with their total expenses
    @Query("SELECT p, COALESCE(SUM(a.expenses), 0) as totalExpenses " +
            "FROM Project p LEFT JOIN p.activities a " +
            "WHERE p.budget.fiscalYear = :fiscalYear " +
            "GROUP BY p")
    List<Object[]> findProjectsWithTotalExpensesByFiscalYear(@Param("fiscalYear") String fiscalYear);

    // Query to find all projects by document ID
    @Query("SELECT p FROM Project p WHERE p.document.documentId = ?1")
    List<Project> findByDocumentId(Integer documentId);

    // Custom projection - fetch main fields and compute progress from activities expense ratio if available
    // This query returns project basic data; progress computation will be done in service
    @Query("SELECT p FROM Project p")
    List<Project> findAllProjectsForDashboard();
}