package com.crud.tanaw.entities;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "documents")
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer document_id;
    private String document_type;
    private String document_title;
    private Date upload_date;

    @OneToMany(mappedBy = "document")
    private List<Budget> budgets = new ArrayList<>();

    @OneToMany(mappedBy = "document")
    private List<Project> projects = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User uploader;

    public Integer getDocument_id() {
        return document_id;
    }

    public void setDocument_id(Integer document_id) {
        this.document_id = document_id;
    }

    public String getDocumentType() {
        return document_type;
    }

    public void setDocumentType(String document_type) {
        this.document_type = document_type;
    }

    public String getDocumentTitle() {
        return document_title;
    }

    public void setDocumentTitle(String document_title) {
        this.document_title = document_title;
    }

    public Date getUpload_date() {
        return upload_date;
    }

    public void setUpload_date(Date upload_date) {
        this.upload_date = upload_date;
    }

    public List<Budget> getBudgets() {
        return budgets;
    }

    public void setBudgets(List<Budget> budgets) {
        this.budgets = budgets;
    }

    public List<Project> getProjects() {
        return projects;
    }

    public void setProjects(List<Project> projects) {
        this.projects = projects;
    }

    public User getUploader() {
        return uploader;
    }

    public void setUploader(User uploader) {
        this.uploader = uploader;
    }
}
