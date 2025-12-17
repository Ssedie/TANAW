package com.crud.tanaw.repositories;

import com.crud.tanaw.dto.dashboardDTO.BudgetDistributionDTO;
import com.crud.tanaw.entities.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Integer> {
    boolean existsByBudgetId(Integer budgetId);
    List<Budget> findByUploaderUserId(Integer userId);
    List<Budget> findByDocumentDocumentId(Integer documentId);

    Budget findTopByOrderByUploadDateDesc();
    @Query("SELECT COALESCE(SUM(b.totalBudget), 0) FROM Budget b")
    Double sumApprovedBudget();

    @Query("SELECT COALESCE(SUM(b.totalExpenses), 0) FROM Budget b")
    Double sumTotalExpenses();

    // Find all budgets for a specific fiscal year
    List<Budget> findByFiscalYear(String fiscalYear);

    // Find budgets by document ID
    List<Budget> findByDocument_DocumentId(Integer documentId);

    // Get total budget for a fiscal year
    @Query("SELECT COALESCE(SUM(b.totalBudget), 0) FROM Budget b WHERE b.fiscalYear = :fiscalYear")
    Double sumTotalBudgetByFiscalYear(@Param("fiscalYear") String fiscalYear);

    // Get total expenses for a fiscal year
    @Query("SELECT COALESCE(SUM(b.totalExpenses), 0) FROM Budget b WHERE b.fiscalYear = :fiscalYear")
    Double sumTotalExpensesByFiscalYear(@Param("fiscalYear") String fiscalYear);

    // Get all distinct fiscal years
    @Query("SELECT DISTINCT b.fiscalYear FROM Budget b ORDER BY b.fiscalYear DESC")
    List<String> findAllDistinctFiscalYears();

    // Group budgets by document.documentType (used as 'sector' here)
    @Query("""
       SELECT new com.crud.tanaw.dto.dashboardDTO.BudgetDistributionDTO(
           b.document.documentType, 
           CAST(SUM(COALESCE(b.totalBudget, 0)) AS DOUBLE)
       )
       FROM Budget b
       GROUP BY b.document.documentType
       """)
    List<BudgetDistributionDTO> findBudgetDistributionByDocumentType();

    @Query("SELECT b FROM Budget b WHERE b.document.documentId = ?1 ORDER BY b.fiscalYear DESC")
    List<Budget> findByDocumentId(Integer documentId);

    @Query("SELECT b FROM Budget b WHERE b.document.documentId = ?1 AND b.fiscalYear = ?2")
    Budget findByDocumentIdAndFiscalYear(Integer documentId, String fiscalYear);

    @Query("SELECT DISTINCT b.fiscalYear FROM Budget b ORDER BY b.fiscalYear DESC")
    List<String> findDistinctFiscalYears();

}
