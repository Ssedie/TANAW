package com.crud.tanaw.services;

import com.crud.tanaw.entities.Budget;
import com.crud.tanaw.repositories.BudgetRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;

    public BudgetService(BudgetRepository budgetRepository) {
        this.budgetRepository = budgetRepository;
    }

    @Transactional
    public Budget updateTotalBudget(Integer budgetId, Double newTotal) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        budget.setTotalBudget(newTotal);
        return budgetRepository.save(budget);
    }
}
