package com.crud.tanaw.repositories;

import com.crud.tanaw.entities.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Integer> {
    boolean existsByBudgetId(Integer budgetId);
    List<Budget> findByUploaderUserId(Integer userId);
    List<Budget> findByDocumentDocumentId(Integer documentId);
}
