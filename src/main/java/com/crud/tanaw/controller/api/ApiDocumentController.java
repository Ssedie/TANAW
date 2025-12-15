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
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/documents")
public class ApiDocumentController {

    private final DocumentService documentService;
    private final DocumentRepository documentRepository;

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
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error creating budget: " + e.getMessage());
        }
    }

    // --- NEW ENDPOINT: Get budgets for a document with fiscal year breakdown ---
    @GetMapping("/{documentId}/budgets")
    public ResponseEntity<List<Map<String, Object>>> getBudgetsForDocument(
            @PathVariable Integer documentId
    ) {
        List<Budget> budgets = budgetRepository.findByDocumentId(documentId);

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
        return ResponseEntity.ok(fiscalYears);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadDocument(@PathVariable Integer id) throws IOException {
        Document doc = documentService.getDocument(id);

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