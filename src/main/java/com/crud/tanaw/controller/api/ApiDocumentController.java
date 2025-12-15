package com.crud.tanaw.controller.api;

import com.crud.tanaw.dto.DocumentDTO;
import com.crud.tanaw.entities.Budget;
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

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class ApiDocumentController {

    private final DocumentService documentService;
    private final DocumentRepository documentRepository;

    public ApiDocumentController(DocumentService documentService, DocumentRepository documentRepository) {
        this.documentService = documentService;
        this.documentRepository = documentRepository;
    }

    @GetMapping
    public ResponseEntity<List<DocumentDTO>> getDocuments(
            @RequestParam(required = false) String type
    ) {
        List<Document> docs;
        if (type != null) {
            docs = documentRepository.findByDocumentType(type);
        } else {
            docs = documentRepository.findAll();
        }
        return ResponseEntity.ok(docs.stream().map(this::toDto).toList());
    }

    @PostMapping("/upload")
    public ResponseEntity<Document> uploadDocument(
            @RequestParam("title") String title,
            @RequestParam("type") String type,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "totalBudget", required = false) Double totalBudget,
            Authentication auth
    ) throws IOException {
        if (!SecurityUtil.isAdmin(auth)) {
            return ResponseEntity.status(403).build();
        }
        if ("Project Plan".equals(type) && totalBudget == null) {
            return ResponseEntity.badRequest()
                    .body(null);
        }


        Integer currentUserId = SecurityUtil.getCurrentUserId(auth);
        User uploader = new User();
        uploader.setUserId(currentUserId);

        Document saved = documentService.uploadDocument(
                file,
                type,
                title,
                uploader,
                type.equals("Project Plan") ? totalBudget : null
        );

        System.out.println("TOTAL BUDGET RECEIVED: " + totalBudget);

        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadDocument(@PathVariable Integer id) throws IOException {
        Document doc = documentService.getDocument(id); // implement fetch from repository

        Path filePath = Paths.get("uploads", Paths.get(doc.getContent()).getFileName().toString());
        byte[] fileBytes = Files.readAllBytes(filePath);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + doc.getDocumentTitle() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(fileBytes);
    }

    private DocumentDTO toDto(Document doc) {
        DocumentDTO dto = new DocumentDTO();
        dto.setDocumentId(doc.getDocumentId());
        dto.setDocumentTitle(doc.getDocumentTitle());
        dto.setDocumentType(doc.getDocumentType());
        dto.setTotalBudget(doc.getTotalBudget());
        return dto;
    }


}

