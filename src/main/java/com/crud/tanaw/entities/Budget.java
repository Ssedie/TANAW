package com.crud.tanaw.entities;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "budgets")
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer budgetId;

    private String fiscalYear;
    private Long approvedBudget;
    private Long totalExpenses;
    private String description;

    @Temporal(TemporalType.TIMESTAMP)
    private Date uploadDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id")
    private Document document;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User uploader;

    // --- Getters & Setters ---
    public Integer getBudgetId() { return budgetId; }
    public void setBudgetId(Integer budgetId) { this.budgetId = budgetId; }

    public String getFiscalYear() { return fiscalYear; }
    public void setFiscalYear(String fiscalYear) { this.fiscalYear = fiscalYear; }

    public Long getApprovedBudget() { return approvedBudget; }
    public void setApprovedBudget(Long approvedBudget) { this.approvedBudget = approvedBudget; }

    public Long getTotalExpenses() { return totalExpenses; }
    public void setTotalExpenses(Long totalExpenses) { this.totalExpenses = totalExpenses; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Date getUploadDate() { return uploadDate; }
    public void setUploadDate(Date uploadDate) { this.uploadDate = uploadDate; }

    public Document getDocument() { return document; }
    public void setDocument(Document document) { this.document = document; }

    public User getUploader() { return uploader; }
    public void setUploader(User uploader) { this.uploader = uploader; }
}
