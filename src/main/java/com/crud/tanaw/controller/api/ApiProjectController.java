package com.crud.tanaw.controller.api;

import com.crud.tanaw.dto.ActivityDTO;
import com.crud.tanaw.dto.ProjectDTO;
import com.crud.tanaw.dto.ReqRep.FeedbackRequest;
import com.crud.tanaw.dto.ReqRep.FeedbackResponseDTO;
import com.crud.tanaw.entities.Document;
import com.crud.tanaw.entities.Feedback;
import com.crud.tanaw.entities.Project;
import com.crud.tanaw.entities.User;
import com.crud.tanaw.repositories.DocumentRepository;
import com.crud.tanaw.repositories.FeedbackRepository;
import com.crud.tanaw.repositories.ProjectRepository;
import com.crud.tanaw.repositories.UserRepository;
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
import java.util.Date;
import java.util.List;
import java.util.UUID;
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
    private UserRepository userRepository;

    @Autowired
    private DocumentRepository documentRepository;

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
            @RequestParam Long planDocumentId,
            Authentication auth
    ) {
        try {
            if (!SecurityUtil.isAdmin(auth)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Only admins can create projects.");
            }

            User user = userRepository.findById(userId.intValue())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Document planDoc = documentRepository.findById(planDocumentId.intValue())
                    .orElseThrow(() -> new RuntimeException("Project Plan not found"));

            // Validate allocated budget
            double usedBudget = projectRepository.findByDocument(planDoc)
                    .stream()
                    .mapToDouble(Project::getAllocatedBudget)
                    .sum();

            double remainingBudget = planDoc.getTotalBudget() - usedBudget;
            if (allocatedBudget > remainingBudget) {
                return ResponseEntity.badRequest()
                        .body("Allocated budget exceeds remaining plan budget");
            }

            Project project = new Project();
            project.setProjectName(projectName);
            project.setDescription(description);
            project.setProjectType(projectType);
            project.setAllocatedBudget((allocatedBudget));
            project.setProjectStatus(projectStatus);
            project.setUser(user);
            project.setDocument(planDoc);

            if (document != null && !document.isEmpty()) {
                Document doc = new Document();
                doc.setDocumentTitle(document.getOriginalFilename());
                doc.setDocumentType(document.getContentType());
                doc.setContent("/uploads/" + UUID.randomUUID() + "_" + document.getOriginalFilename());
                doc.setUploader(user);
                Document savedDoc = documentRepository.save(doc);
                project.setDocument(savedDoc);
            }

            Project savedProject = projectRepository.save(project);
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(savedProject));

        } catch (Exception e) {
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
