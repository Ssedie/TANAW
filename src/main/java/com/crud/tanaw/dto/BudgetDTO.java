package com.crud.tanaw.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BudgetDTO {

    @NotBlank(message = "Please enter a valid Fiscal Year.")
    private String fiscalYear;

    @NotBlank(message="Please provide the approved budget.")
    private Double approvedBudget;
    @NotBlank(message="Please provide the total expenses for the project.")
    private Double totalExpenses;
    @NotBlank(message="Please give a brief description of the use of the budget.")
    private String description;

}
