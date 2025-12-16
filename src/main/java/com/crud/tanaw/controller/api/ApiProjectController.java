package com.crud.tanaw.controller.api;

import com.crud.tanaw.dto.ActivityDTO;
import com.crud.tanaw.dto.ProjectDTO;
import com.crud.tanaw.dto.ReqRep.FeedbackRequest;
import com.crud.tanaw.dto.ReqRep.FeedbackResponseDTO;
import com.crud.tanaw.entities.*;
import com.crud.tanaw.repositories.*;
import com.crud.tanaw.services.DocumentService;
import com.crud.tanaw.utility.SecurityUtil;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/projects")
public class ApiProjectController {

    @Autowired
    private DocumentService documentService;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DocumentRepository documentRepository;

    // --- NEW ENDPOINT: Get available budget for a document/plan ---
    @GetMapping("/budget/{budgetId}")
    public ResponseEntity<Map<String, Object>> getAvailableBudget(
            @PathVariable Integer budgetId
    ) {
        try {
            System.out.println("=== Available Budget Endpoint ===");
            System.out.println("Budget ID: " + budgetId);

            // Fetch the budget
            Budget budget = budgetRepository.findById(budgetId)
                    .orElseThrow(() -> new RuntimeException("Budget not found"));

            System.out.println("Fiscal Year: " + budget.getFiscalYear());
            System.out.println("Total Budget: " + budget.getTotalBudget());

            // Check if total budget is set
            if (budget.getTotalBudget() == null || budget.getTotalBudget() == 0) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "This budget does not have a total amount set"));
            }

            // Calculate used budget from all projects linked to this budget
            Double usedBudgetQuery = projectRepository.sumAllocatedBudgetByBudgetId(budgetId);
            double usedBudget = (usedBudgetQuery != null) ? usedBudgetQuery : 0;

            System.out.println("Used Budget: " + usedBudget);

            double availableBudget = budget.getTotalBudget() - usedBudget;
            System.out.println("Available Budget: " + availableBudget);

            Map<String, Object> response = new HashMap<>();
            response.put("budgetId", budgetId);
            response.put("fiscalYear", budget.getFiscalYear());
            response.put("totalBudget", budget.getTotalBudget());
            response.put("usedBudget", usedBudget);
            response.put("availableBudget", Math.max(availableBudget, 0));

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            System.err.println("RuntimeException: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Exception: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Server error: " + e.getMessage()));
        }
    }

    // --- Get current fiscal year and available years ---
    @GetMapping("/fiscal-year/current")
    public ResponseEntity<Map<String, Object>> getCurrentFiscalYear() {
        Map<String, Object> response = new HashMap<>();
        response.put("currentFiscalYear", java.time.Year.now().toString());
        return ResponseEntity.ok(response);
    }

    // --- Get budgets for a document ---
    @GetMapping("/budgets/document/{documentId}")
    public ResponseEntity<List<Map<String, Object>>> getBudgetsByDocument(
            @PathVariable Integer documentId
    ) {
        List<Budget> budgets = budgetRepository.findByDocumentId(documentId);
        List<Map<String, Object>> response = new ArrayList<>();

        for (Budget budget : budgets) {
            Double usedBudget = projectRepository.sumAllocatedBudgetByBudgetId(budget.getBudgetId());
            usedBudget = (usedBudget != null) ? usedBudget : 0;
            double available = (budget.getTotalBudget() != null) ? budget.getTotalBudget() - usedBudget : 0;

            Map<String, Object> budgetInfo = new HashMap<>();
            budgetInfo.put("budgetId", budget.getBudgetId());
            budgetInfo.put("fiscalYear", budget.getFiscalYear());
            budgetInfo.put("totalBudget", budget.getTotalBudget());
            budgetInfo.put("usedBudget", usedBudget);
            budgetInfo.put("availableBudget", Math.max(available, 0));

            response.add(budgetInfo);
        }

        return ResponseEntity.ok(response);
    }

    // --- List all projects ---
    @GetMapping
    public ResponseEntity<List<ProjectDTO>> getProjects() {
        List<ProjectDTO> projects = projectRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(projects);
    }

    // --- Add new project with optional file upload ---
    @PostMapping
    public ResponseEntity<?> addProject(
            @RequestParam @NotBlank String projectName,
            @RequestParam @NotBlank String description,
            @RequestParam @NotBlank String projectType,
            @RequestParam @NotNull Double allocatedBudget,
            @RequestParam @NotBlank String projectStatus,
            @RequestParam(required = false) MultipartFile document,
            @RequestParam Long userId,
            @RequestParam Long budgetId,
            Authentication auth
    ) {
        try {
            if (!SecurityUtil.isAdmin(auth)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Only admins can create projects.");
            }

            User user = userRepository.findById(userId.intValue())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Budget budget = budgetRepository.findById(budgetId.intValue())
                    .orElseThrow(() -> new RuntimeException("Budget not found"));

            Document planDoc = budget.getDocument();
            if (planDoc == null) {
                return ResponseEntity.badRequest()
                        .body("Budget is not linked to a document");
            }

            // Validate allocated budget
            Double usedBudget = projectRepository.sumAllocatedBudgetByBudgetId(budgetId.intValue());
            usedBudget = (usedBudget != null) ? usedBudget : 0;

            double remainingBudget = budget.getTotalBudget() - usedBudget;
            if (allocatedBudget > remainingBudget) {
                return ResponseEntity.badRequest()
                        .body("Allocated budget exceeds remaining budget for FY " + budget.getFiscalYear());
            }

            Project project = new Project();
            project.setProjectName(projectName);
            project.setDescription(description);
            project.setProjectType(projectType);
            project.setAllocatedBudget(allocatedBudget);
            project.setProjectStatus(projectStatus);
            project.setUser(user);
            project.setDocument(planDoc);
            project.setBudget(budget);

            // If user uploads a document, save it separately
            if (document != null && !document.isEmpty()) {
                try {
                    Document uploadedDoc = new Document();
                    uploadedDoc.setDocumentTitle(document.getOriginalFilename());
                    uploadedDoc.setDocumentType(document.getContentType());
                    uploadedDoc.setContent("/uploads/" + UUID.randomUUID() + "_" + document.getOriginalFilename());
                    uploadedDoc.setUploader(user);
                    documentRepository.save(uploadedDoc);
                    System.out.println("Project document uploaded: " + uploadedDoc.getDocumentId());
                } catch (Exception e) {
                    System.err.println("Warning: Could not save uploaded document: " + e.getMessage());
                }
            }

            Project savedProject = projectRepository.save(project);

            System.out.println("Project created successfully");
            System.out.println("Project ID: " + savedProject.getProjectId());
            System.out.println("Budget ID: " + savedProject.getBudget().getBudgetId());
            System.out.println("Fiscal Year: " + savedProject.getFiscalYear());
            System.out.println("Allocated Budget: " + savedProject.getAllocatedBudget());

            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(savedProject));

        } catch (Exception e) {
            System.err.println("Error creating project: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error creating project: " + e.getMessage());
        }
    }

    @GetMapping("/{projectId}/feedbacks")
    public ResponseEntity<List<FeedbackResponseDTO>> getFeedbacks(
            @PathVariable Integer projectId
    ) {
        return ResponseEntity.ok(
                feedbackRepository
                        .findByProjectIdOrderByUploadDateDesc(projectId)
                        .stream()
                        .map(this::convertToDTO)
                        .toList()
        );
    }


    @PostMapping("/{projectId}/feedbacks")
    public ResponseEntity<?> addFeedback(
            @PathVariable Integer projectId,
            @RequestBody FeedbackRequest request,
            Authentication auth
    ) {
        if (!SecurityUtil.isCitizen(auth)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Feedback feedback = new Feedback();
        feedback.setContent(request.getContent());
        feedback.setRating(request.getRating());
        feedback.setUser(user);
        feedback.setProject(project);
        feedback.setUploadDate(new Date());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(convertToDTO(feedbackRepository.save(feedback)));
    }

    private FeedbackResponseDTO convertToDTO(Feedback f) {
        FeedbackResponseDTO dto = new FeedbackResponseDTO();
        dto.setFeedbackId(f.getFeedbackId());
        dto.setContent(f.getContent());
        dto.setRating(f.getRating());
        dto.setUploadDate(f.getUploadDate());

        if (f.getProject() != null) {
            dto.setProjectId(f.getProject().getProjectId());
        }

        return dto;
    }



    private static final SimpleDateFormat DATE_FMT = new SimpleDateFormat("yyyy-MM-dd");

    // --- Helper: Convert Project entity to DTO ---
    private ProjectDTO convertToDTO(Project p) {
        ProjectDTO dto = new ProjectDTO();
        dto.setProjectId(p.getProjectId());
        dto.setProjectName(p.getProjectName());
        dto.setDescription(p.getDescription());
        dto.setProjectType(p.getProjectType());
        dto.setAllocatedBudget(p.getAllocatedBudget());
        dto.setProjectStatus(p.getProjectStatus());
        dto.setFeedback(p.getFeedback());
        dto.setDocumentId(p.getDocument() != null ? p.getDocument().getDocumentId() : null);

        // --- NEW: map activities ---
        if (p.getActivities() != null) {
            dto.setActivities(
                    p.getActivities().stream()
                            .map(a -> {
                                ActivityDTO aDto = new ActivityDTO();
                                aDto.setActivityId(a.getActivityId());
                                aDto.setActivityName(a.getActivityName());
                                aDto.setDescription(a.getDescription());
                                if (a.getDate() != null) {
                                    aDto.setDate(DATE_FMT.format(a.getDate()));
                                } else {
                                    aDto.setDate(null);
                                }
                                aDto.setStatus(a.getStatus());
                                aDto.setExpenses(a.getExpenses());
                                aDto.setProjectId(p.getProjectId());
                                aDto.setProjectName(p.getProjectName());
                                aDto.setType(a.getType());
                                return aDto;
                            })
                            .collect(Collectors.toList())
            );
        }

        return dto;
    }
}