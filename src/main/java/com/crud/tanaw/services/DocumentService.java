package com.crud.tanaw.services;

import com.crud.tanaw.entities.Document;
import com.crud.tanaw.entities.User;
import com.crud.tanaw.repositories.BudgetRepository;
import com.crud.tanaw.repositories.DocumentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class DocumentService {

    private static final Path UPLOAD_PATH = Paths.get("uploads");

    private final DocumentRepository documentRepository;
    private final BudgetRepository budgetRepository;

    public DocumentService(DocumentRepository documentRepository, BudgetRepository budgetRepository) {
        this.documentRepository = documentRepository;
        this.budgetRepository = budgetRepository;
    }

    @Transactional
    public Document uploadDocument(
            MultipartFile file,
            String documentType,
            String documentTitle,
            User user, Double totalBudget
    ) throws IOException {

        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        if (!Files.exists(UPLOAD_PATH)) {
            Files.createDirectories(UPLOAD_PATH);
        }

        String originalName = file.getOriginalFilename();
        String extension = "";

        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf("."));
        }

        String storedFileName = UUID.randomUUID() + extension;

        Path filePath = UPLOAD_PATH.resolve(storedFileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        System.out.println(storedFileName);

        Document document = new Document();
        document.setDocumentType(documentType);
        document.setDocumentTitle(documentTitle);

        // ✅ IMPORTANT: store web path, not disk path
        document.setFilePath("/uploads/" + storedFileName);
        document.setUploader(user);
        if (totalBudget != null) {
            document.setTotalBudget(totalBudget);
        }

        return documentRepository.save(document);
    }

    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    public Document getDocument(Integer id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found with ID: " + id));
    }


}
