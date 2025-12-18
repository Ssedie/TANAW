package com.crud.tanaw.controller.api;

import com.crud.tanaw.dto.ActivityDTO;
import com.crud.tanaw.dto.ProjectDTO;
import com.crud.tanaw.dto.ReqRep.FeedbackRequest;
import com.crud.tanaw.dto.ReqRep.FeedbackResponseDTO;
import com.crud.tanaw.entities.*;
import com.crud.tanaw.repositories.*;
import com.crud.tanaw.services.FileStorageService;
import com.crud.tanaw.utility.SecurityUtil;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ApiProjectController {

    private final ProjectRepository projectRepository;
    private final BudgetRepository budgetRepository;
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final FeedbackRepository feedbackRepository;
    private final FileStorageService fileStorageService;

    /**
     * Get current fiscal year
     */
    @GetMapping("/fiscal-year/current")
    public ResponseEntity<Map<String, String>> getCurrentFiscalYear() {
        int currentYear = LocalDate.now().getYear();
        String fiscalYear = String.valueOf(currentYear);

        Map<String, String> response = new HashMap<>();
        response.put("currentFiscalYear", fiscalYear);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all projects, PROPERLY filtered by fiscal year
     */
    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects(
            @RequestParam(required = false) String fiscalYear
    ) {
        if (fiscalYear != null && !fiscalYear.isEmpty()) {
            // Filter by fiscal year through Budget relationship
            return ResponseEntity.ok(projectRepository.findByBudget_FiscalYear(fiscalYear));
        }
        return ResponseEntity.ok(projectRepository.findAll());
    }

    /**
     * Get project by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Integer id) {
        return projectRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get projects by budget ID
     */
    @GetMapping("/budget/{budgetId}")
    public ResponseEntity<Map<String, Object>> getProjectsByBudget(@PathVariable Integer budgetId) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        List<Project> projects = projectRepository.findByBudgetId(budgetId);

        // Calculate available budget
        Double totalAllocated = projects.stream()
                .mapToDouble(p -> p.getAllocatedBudget() != null ? p.getAllocatedBudget() : 0)
                .sum();

        Double availableBudget = budget.getTotalBudget() - totalAllocated;

        Map<String, Object> response = new HashMap<>();
        response.put("projects", projects);
        response.put("availableBudget", availableBudget);
        response.put("totalBudget", budget.getTotalBudget());
        response.put("totalAllocated", totalAllocated);
        response.put("fiscalYear", budget.getFiscalYear());

        return ResponseEntity.ok(response);
    }

    /**
     * Create a new project - ENSURES fiscal year is set from budget
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addProject(
            @RequestParam @NotBlank String projectName,
            @RequestParam @NotBlank String description,
            @RequestParam @NotBlank String projectType,
            @RequestParam @NotNull Double allocatedBudget,
            @RequestParam @NotBlank String projectStatus,
            @RequestParam(required = false) MultipartFile document,
            @RequestParam(value = "coverPhoto", required = false) MultipartFile coverPhoto,
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
                    uploadedDoc.setFilePath("/uploads/" + UUID.randomUUID() + "_" + document.getOriginalFilename());
                    uploadedDoc.setUploader(user);
                    documentRepository.save(uploadedDoc);
                    System.out.println("Project document uploaded: " + uploadedDoc.getDocumentId());
                } catch (Exception e) {
                    System.err.println("Warning: Could not save uploaded document: " + e.getMessage());
                }
            }

            if (coverPhoto != null && !coverPhoto.isEmpty()) {
                String coverUrl = fileStorageService.saveFile(coverPhoto, "projects");
                project.setCoverPhotoUrl(coverUrl);
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

    /**
     * Get projects by user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Project>> getProjectsByUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(projectRepository.findByUserUserId(userId));
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
        dto.setCoverPhotoUrl(p.getCoverPhotoUrl());
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