package com.crud.tanaw.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "budgets")
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer budgetId;

    private String fiscalYear;
    private Double totalBudget;
    private Double totalExpenses;
    private String description;

    @Temporal(TemporalType.TIMESTAMP)
    private Date uploadDate;

    @OneToMany(mappedBy = "budget")  // NEW: Link back to projects
    @JsonManagedReference
    private List<Project> projects = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id")
    @JsonBackReference
    private Document document;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private User uploader;

    // --- Getters & Setters ---
    public Integer getBudgetId() { return budgetId; }
    public void setBudgetId(Integer budgetId) { this.budgetId = budgetId; }

    public String getFiscalYear() { return fiscalYear; }
    public void setFiscalYear(String fiscalYear) { this.fiscalYear = fiscalYear; }

    public Double getTotalBudget() { return totalBudget; }
    public void setTotalBudget(Double totalBudget) { this.totalBudget = totalBudget; }

    public Double getTotalExpenses() { return totalExpenses; }
    public void setTotalExpenses(Double totalExpenses) { this.totalExpenses = totalExpenses; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Date getUploadDate() { return uploadDate; }
    public void setUploadDate(Date uploadDate) { this.uploadDate = uploadDate; }

    public Document getDocument() { return document; }
    public void setDocument(Document document) { this.document = document; }

    public User getUploader() { return uploader; }
    public void setUploader(User uploader) { this.uploader = uploader; }

    public List<Project> getProjects() {
        return projects;
    }
    public void setProjects(List<Project> projects) {
        this.projects = projects;
    }
}
