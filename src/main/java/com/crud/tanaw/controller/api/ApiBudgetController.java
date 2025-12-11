package com.crud.tanaw.controller.api;

import com.crud.tanaw.dto.dashboardDTO.UpdateBudgetDTO;
import com.crud.tanaw.entities.Budget;
import com.crud.tanaw.services.BudgetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/budgets")
public class ApiBudgetController {

    private final BudgetService budgetService;

    public ApiBudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @PutMapping("/{budgetId}")
    public ResponseEntity<Budget> updateTotalBudget(
            @PathVariable Integer budgetId,
            @RequestBody UpdateBudgetDTO dto
    ) {
        Budget updated = budgetService.updateTotalBudget(budgetId, dto.getTotalBudget());
        return ResponseEntity.ok(updated);
    }
}
