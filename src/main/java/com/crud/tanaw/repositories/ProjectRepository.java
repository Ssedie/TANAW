package com.crud.tanaw.repositories;

import com.crud.tanaw.entities.Document;
import com.crud.tanaw.entities.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Integer> {
    boolean existsByProjectId(Integer projectId);
    List<Project> findByUserUserId(Integer userId);

    Long countByProjectStatus(String status);

    List<Project> findByDocument(Document document);

    @Query("SELECT COUNT(p) FROM Project p WHERE p.endDate >= ?1")
    Long countOnTime(Date today);

    @Query("SELECT COUNT(p) FROM Project p WHERE p.endDate < ?1")
    Long countDelayed(Date today);

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

    // Query to find all projects by document ID
    @Query("SELECT p FROM Project p WHERE p.document.documentId = ?1")
    List<Project> findByDocumentId(Integer documentId);

    // Custom projection - fetch main fields and compute progress from activities expense ratio if available
    // This query returns project basic data; progress computation will be done in service
    @Query("SELECT p FROM Project p")
    List<Project> findAllProjectsForDashboard();
}