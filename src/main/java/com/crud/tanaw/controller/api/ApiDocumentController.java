package com.crud.tanaw.controller.api;

import com.crud.tanaw.entities.Document;
import com.crud.tanaw.entities.User;
import com.crud.tanaw.repositories.DocumentRepository;
import com.crud.tanaw.services.DocumentService;
import com.crud.tanaw.utility.SecurityUtil;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/documents")
public class ApiDocumentController {

    private final DocumentRepository documentRepository;
    private final DocumentService documentService;

    public ApiDocumentController(DocumentRepository documentRepository, DocumentService documentService) {
        this.documentRepository = documentRepository;
        this.documentService = documentService;
    }

    @PostMapping("/upload")
    public ResponseEntity<Document> uploadDocument(
            @RequestParam("title") String title,
            @RequestParam("type") String type,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "totalBudget", required = false) Double totalBudget,
            Authentication auth
    ) {
        try {
            if (!SecurityUtil.isAdmin(auth)) {
                return ResponseEntity.status(403).build();
            }

            Integer currentUserId = SecurityUtil.getCurrentUserId(auth);
            User uploader = new User();
            uploader.setUserId(currentUserId);

            Document doc = new Document();
            doc.setDocumentTitle(title);
            doc.setDocumentType(type);
            doc.setContent(file.getBytes());
            doc.setUploader(uploader);

            // Only Project Plan has totalBudget
            Document saved = documentService.uploadDocument(doc, type.equals("Project Plan") ? totalBudget : null);

            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace(); // For debugging
            return ResponseEntity.status(500).body(null);
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
