package com.crud.tanaw.dto.dashboardDTO;

public class BudgetDistributionDTO {

    private String documentType;
    private Double totalBudget;

    // --- Constructors ---
    public BudgetDistributionDTO() {}

    public BudgetDistributionDTO(String documentType, Double totalBudget) {
        this.documentType = documentType;
        this.totalBudget = totalBudget;
    }

    // --- Getters & Setters ---
    public String getDocumentType() {
        return documentType;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }

    public Double getTotalBudget() {
        return totalBudget;
    }

    public void setTotalBudget(Double totalBudget) {
        this.totalBudget = totalBudget;
    }
}
