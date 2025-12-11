package com.crud.tanaw.controller.api;

import com.crud.tanaw.entities.Document;
import com.crud.tanaw.repositories.DocumentRepository;
import com.crud.tanaw.services.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/documents")
public class ApiDocumentController {

    @Autowired
    private DocumentRepository documentRepository;

    private DocumentService documentService;

    @PostMapping("/upload")
    public ResponseEntity<Document> uploadDocument(
            @RequestParam("title") String title,
            @RequestParam("type") String type,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "totalBudget", required = false) Double totalBudget
    ) {
        try {
            Document doc = new Document();
            doc.setDocumentTitle(title);
            doc.setDocumentType(type);
            doc.setContent(file.getBytes());
            doc.setUploader(authenticatedUser); // set current logged-in admin

            Document saved = documentService.uploadDocument(doc, totalBudget);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadDocument(@PathVariable Integer id) {
        Document doc = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + doc.getDocumentTitle() + "\"")
                .contentType(MediaType.parseMediaType(doc.getDocumentType()))
                .body(doc.getContent());
    }

}
