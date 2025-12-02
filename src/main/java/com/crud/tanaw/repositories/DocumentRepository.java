package com.crud.tanaw.repositories;

import com.crud.tanaw.entities.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Integer> {
    boolean existsByDocumentId(Integer documentId);
    List<Document> findByUploaderUserId(Integer userId);
}
