package com.crud.tanaw.dto.dashboardDTO;

public class BudgetDistributionDTO {

    private String sector;
    private Double amount;

    public BudgetDistributionDTO() {}
    public BudgetDistributionDTO(String sector, Double amount) {
        this.sector = sector;
        this.amount = amount;
    }

    public String getSector() { return sector; }
    public void setSector(String sector) { this.sector = sector; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
}
