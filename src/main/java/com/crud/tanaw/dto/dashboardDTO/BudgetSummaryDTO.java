package com.crud.tanaw.dto.dashboardDTO;

public record BudgetSummaryDTO(
        String documentTitle,
        Double totalApprovedBudget,
        Double totalExpenses
) {
}
