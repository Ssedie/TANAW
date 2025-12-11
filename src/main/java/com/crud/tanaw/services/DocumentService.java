package com.crud.tanaw.services;

import com.crud.tanaw.entities.Budget;
import com.crud.tanaw.entities.Document;
import com.crud.tanaw.repositories.BudgetRepository;
import com.crud.tanaw.repositories.DocumentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final BudgetRepository budgetRepository;

    public DocumentService(DocumentRepository documentRepository, BudgetRepository budgetRepository) {
        this.documentRepository = documentRepository;
        this.budgetRepository = budgetRepository;
    }

    @Transactional
    public Document uploadDocument(Document document, Double totalBudget) {
        document.setUploadDate(new Date());

        // Save the document first
        Document savedDoc = documentRepository.save(document);

        // If this document is an "Approved Budget", create a budget entry
        if ("Approved Budget".equalsIgnoreCase(document.getDocumentType()) && totalBudget != null) {
            Budget budget = new Budget();
            budget.setTotalBudget(totalBudget);
            budget.setTotalExpenses(0.0);
            budget.setFiscalYear("FY " + new Date().getYear()); // you can make it dynamic
            budget.setDescription("Auto-generated from document upload");
            budget.setUploadDate(new Date());
            budget.setDocument(savedDoc);
            budgetRepository.save(budget);
        }

        return savedDoc;
    }
}
