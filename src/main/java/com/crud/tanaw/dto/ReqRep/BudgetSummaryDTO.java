package com.crud.tanaw.dto.ReqRep;

public class BudgetSummaryDTO {

    private String fiscalYear;
    private Double totalBudget;
    private Double totalSpent;
    private Double remaining;

    // --- Constructor used in JPQL query ---
    public BudgetSummaryDTO(String fiscalYear, Double totalBudget, Double totalSpent, Double remaining) {
        this.fiscalYear = fiscalYear;
        this.totalBudget = totalBudget;
        this.totalSpent = totalSpent;
        this.remaining = remaining;
    }

    // --- Getters & Setters ---
    public String getFiscalYear() {
        return fiscalYear;
    }

    public void setFiscalYear(String fiscalYear) {
        this.fiscalYear = fiscalYear;
    }

    public Double getTotalBudget() {
        return totalBudget;
    }

    public void setTotalBudget(Double totalBudget) {
        this.totalBudget = totalBudget;
    }

    public Double getTotalSpent() {
        return totalSpent;
    }

    public void setTotalSpent(Double totalSpent) {
        this.totalSpent = totalSpent;
    }

    public Double getRemaining() {
        return remaining;
    }

    public void setRemaining(Double remaining) {
        this.remaining = remaining;
    }
}
