package com.crud.tanaw.repositories;

import com.crud.tanaw.entities.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.w3c.dom.DocumentType;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Integer> {
    boolean existsByDocumentId(Integer documentId);
    List<Document> findByUploaderUserId(Integer userId);
    Optional<Document> findById(Integer integer);
    List<Document> findByDocumentType(String documentType);

    @Query("SELECT SUM(d.totalBudget) FROM Document d WHERE d.documentType = 'Project Plan'")
    Double getTotalProjectPlanBudget();
}
