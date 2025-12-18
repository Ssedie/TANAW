package com.crud.tanaw.controller.api;

import com.crud.tanaw.dto.DocumentDTO;
import com.crud.tanaw.entities.Budget;
import com.crud.tanaw.entities.Document;
import com.crud.tanaw.entities.User;
import com.crud.tanaw.repositories.BudgetRepository;
import com.crud.tanaw.repositories.DocumentRepository;
import com.crud.tanaw.services.DocumentService;
import com.crud.tanaw.utility.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.*;

@RestController
@RequestMapping("/api/documents")
public class ApiDocumentController {

    private final DocumentService documentService;
    private final DocumentRepository documentRepository;

    @Value("${file.documents-dir:uploads/documents}")
    private String documentsDir;

    @Autowired
    private BudgetRepository budgetRepository;

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
    public ResponseEntity<?> uploadDocument(
            @RequestParam("title") String title,
            @RequestParam("type") String type,
            @RequestParam("file") MultipartFile file,
            Authentication auth
    ) throws IOException {
        if (!SecurityUtil.isAdmin(auth)) {
            return ResponseEntity.status(403).body("Only admins can upload documents");
        }

        Integer currentUserId = SecurityUtil.getCurrentUserId(auth);
        User uploader = new User();
        uploader.setUserId(currentUserId);

        Document saved = documentService.uploadDocument(
                file,
                type,
                title,
                uploader,
                null  // No total budget needed - budgets are created separately
        );

        System.out.println("Document uploaded: " + saved.getDocumentId());
        System.out.println("Type: " + type);

        return ResponseEntity.ok(saved);
    }

    // --- NEW ENDPOINT: Create a budget for a project plan ---
    @PostMapping("/budget")
    public ResponseEntity<?> createBudget(
            @RequestBody Map<String, Object> request,
            Authentication auth
    ) {
        try {
            if (!SecurityUtil.isAdmin(auth)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Only admins can create budgets");
            }

            // Parse documentId - handle both String and Number
            Long documentId;
            Object docIdObj = request.get("documentId");
            if (docIdObj instanceof String) {
                documentId = Long.parseLong((String) docIdObj);
            } else if (docIdObj instanceof Number) {
                documentId = ((Number) docIdObj).longValue();
            } else {
                return ResponseEntity.badRequest().body("Invalid documentId");
            }

            String fiscalYear = (String) request.get("fiscalYear");

            // Parse totalBudget - handle both String and Number
            Double totalBudget;
            Object budgetObj = request.get("totalBudget");
            if (budgetObj instanceof String) {
                totalBudget = Double.parseDouble((String) budgetObj);
            } else if (budgetObj instanceof Number) {
                totalBudget = ((Number) budgetObj).doubleValue();
            } else {
                return ResponseEntity.badRequest().body("Invalid totalBudget");
            }

            String description = (String) request.get("description");

            Document document = documentRepository.findById(documentId.intValue())
                    .orElseThrow(() -> new RuntimeException("Document not found"));

            Integer currentUserId = SecurityUtil.getCurrentUserId(auth);
            User uploader = new User();
            uploader.setUserId(currentUserId);

            Budget budget = new Budget();
            budget.setDocument(document);
            budget.setFiscalYear(fiscalYear);
            budget.setTotalBudget(totalBudget);
            budget.setDescription(description);
            budget.setUploader(uploader);
            budget.setUploadDate(new Date());

            Budget savedBudget = budgetRepository.save(budget);

            System.out.println("Budget created successfully");
            System.out.println("Budget ID: " + savedBudget.getBudgetId());
            System.out.println("Fiscal Year: " + fiscalYear);
            System.out.println("Total Budget: " + totalBudget);

            Map<String, Object> response = new HashMap<>();
            response.put("budgetId", savedBudget.getBudgetId());
            response.put("documentId", savedBudget.getDocument().getDocumentId());
            response.put("fiscalYear", savedBudget.getFiscalYear());
            response.put("totalBudget", savedBudget.getTotalBudget());

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            System.err.println("Error creating budget: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(BAD_REQUEST)
                    .body("Error creating budget: " + e.getMessage());
        }
    }

    // --- NEW ENDPOINT: Get budgets for a document with fiscal year breakdown ---
    @GetMapping("/{documentId}/budgets")
    public ResponseEntity<List<Map<String, Object>>> getBudgetsForDocument(
            @PathVariable Integer documentId
    ) {
        List<Budget> budgets = budgetRepository.findByDocumentId(documentId);

        // Sort budgets by fiscal year (ascending order for chronological display)
        budgets.sort((a, b) -> {
            try {
                return Integer.compare(Integer.parseInt(a.getFiscalYear()), Integer.parseInt(b.getFiscalYear()));
            } catch (NumberFormatException e) {
                return a.getFiscalYear().compareTo(b.getFiscalYear());
            }
        });

        List<Map<String, Object>> response = budgets.stream().map(budget -> {
            Map<String, Object> budgetInfo = new HashMap<>();
            budgetInfo.put("budgetId", budget.getBudgetId());
            budgetInfo.put("fiscalYear", budget.getFiscalYear());
            budgetInfo.put("totalBudget", budget.getTotalBudget());
            budgetInfo.put("totalExpenses", budget.getTotalExpenses());
            budgetInfo.put("description", budget.getDescription());
            return budgetInfo;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    // --- NEW ENDPOINT: Get all fiscal years available ---
    @GetMapping("/fiscal-years")
    public ResponseEntity<List<String>> getAvailableFiscalYears() {
        List<String> fiscalYears = budgetRepository.findDistinctFiscalYears();

        // Sort fiscal years numerically in descending order (newest first)
        fiscalYears.sort((a, b) -> {
            try {
                return Integer.compare(Integer.parseInt(b), Integer.parseInt(a));
            } catch (NumberFormatException e) {
                return b.compareTo(a); // Fallback to string comparison
            }
        });

        return ResponseEntity.ok(fiscalYears);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Integer id) {
        var document = documentService.getDocument(id);

        if (document.getFilePath() == null || document.getFilePath().isEmpty()) {
            throw new ResponseStatusException(BAD_REQUEST, "No file attached to this document");
        }

        try {
            String storedFileName = Paths.get(document.getFilePath()).getFileName().toString();
            Path filePath = Paths.get("uploads").resolve(storedFileName).normalize();

            if (!Files.exists(filePath)) {
                throw new ResponseStatusException(NOT_FOUND, "File not found on server");
            }

            Resource resource = new UrlResource(filePath.toUri());

            // Extract extension
            String extension = "";
            int lastDotIndex = storedFileName.lastIndexOf('.');
            if (lastDotIndex > 0) {
                extension = storedFileName.substring(lastDotIndex);
            }

            // Use stored filename directly instead of document title
            String downloadFileName = storedFileName;

            String contentType = getContentTypeFromExtension(extension);

            // Debug logging
            System.out.println("Extension: " + extension);
            System.out.println("Content-Type: " + contentType);
            System.out.println("Download filename: " + downloadFileName);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + downloadFileName + "\"")
                    .body(resource);

        } catch (Exception e) {
            throw new ResponseStatusException(INTERNAL_SERVER_ERROR, "Error while downloading file", e);
        }
    }

    private String getContentTypeFromExtension(String extension) {
        return switch (extension.toLowerCase()) {
            case ".pdf" -> "application/pdf";
            case ".doc" -> "application/msword";
            case ".docx" -> "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            case ".xls" -> "application/vnd.ms-excel";
            case ".xlsx" -> "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            case ".ppt" -> "application/vnd.ms-powerpoint";
            case ".pptx" -> "application/vnd.openxmlformats-officedocument.presentationml.presentation";
            case ".txt" -> "text/plain";
            case ".csv" -> "text/csv";
            case ".jpg", ".jpeg" -> "image/jpeg";
            case ".png" -> "image/png";
            case ".gif" -> "image/gif";
            case ".zip" -> "application/zip";
            case ".rar" -> "application/x-rar-compressed";
            default -> "application/octet-stream";
        };
    }


    private DocumentDTO toDto(Document doc) {
        DocumentDTO dto = new DocumentDTO();
        dto.setDocumentId(doc.getDocumentId());
        dto.setDocumentTitle(doc.getDocumentTitle());
        dto.setDocumentType(doc.getDocumentType());
        dto.setTotalBudget(doc.getTotalBudget());
        dto.setFilePath(doc.getFilePath());
        return dto;
    }
}