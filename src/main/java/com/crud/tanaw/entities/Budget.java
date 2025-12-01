package com.crud.tanaw.entities;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "budgets")
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer budget_id;
    private String fiscal_year;
    private Long approved_budget;
    private Long total_expenses;
    private String description;
    private Date upload_date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id")
    private Document document;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User uploader;

    public Integer getBudgetId() {
        return budget_id;
    }

    public void setBudgetId(Integer budget_id) {
        this.budget_id = budget_id;
    }

    public String getFiscalYear() {
        return fiscal_year;
    }

    public void setFiscalYear(String fiscal_year) {
        this.fiscal_year = fiscal_year;
    }

    public Long getApprovedBudget() {
        return approved_budget;
    }

    public void setApprovedBudget(Long approved_budget) { this.approved_budget = approved_budget; }

    public Long getTotalExpenses() {
        return total_expenses;
    }

    public void setTotalExpenses(Long total_expenses) {
        this.total_expenses = total_expenses;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getUploadDate() {
        return upload_date;
    }

    public void setUploadDate(Date upload_date) {
        this.upload_date = upload_date;
    }

    public Document getDocument() {
        return document;
    }

    public void setDocument(Document document) {
        this.document = document;
    }

    public User getUploader() {
        return uploader;
    }

    public void setUploader(User uploader) {
        this.uploader = uploader;
    }
}
