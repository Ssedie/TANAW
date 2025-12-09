package com.crud.tanaw.controller.api;

import com.crud.tanaw.dto.ProjectDTO;
import com.crud.tanaw.entities.Document;
import com.crud.tanaw.entities.Project;
import com.crud.tanaw.entities.User;
import com.crud.tanaw.repositories.DocumentRepository;
import com.crud.tanaw.repositories.ProjectRepository;
import com.crud.tanaw.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/projects")
public class ApiProjectController {

    @Autowired
    private ProjectRepository projectRepository;

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
            @RequestParam @NotBlank(message = "Project name is required") String projectName,
            @RequestParam @NotBlank(message = "Description is required") String description,
            @RequestParam @NotBlank(message = "Allocated budget is required") String allocatedBudget,
            @RequestParam @NotBlank(message = "Project status is required") String projectStatus,
            @RequestParam(required = false) String feedback,
            @RequestParam(required = false) MultipartFile document,
            @RequestParam Long userId
    ) {
        try {
            // Check user existence
            User user = userRepository.findById(userId.intValue())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Project project = new Project();
            project.setProjectName(projectName);
            project.setDescription(description);
            project.setAllocatedBudget(allocatedBudget);
            project.setProjectStatus(projectStatus);
            project.setFeedback(feedback);
            project.setUser(user);

            // Handle file upload
            if (document != null && !document.isEmpty()) {
                Document doc = new Document();
                doc.setDocumentTitle(document.getOriginalFilename());
                doc.setDocumentType(document.getContentType());
                doc.setContent(document.getBytes());
                doc.setUploadDate(new Date());
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

    // --- Helper: Convert Project entity to DTO ---
    private ProjectDTO convertToDTO(Project p) {
        ProjectDTO dto = new ProjectDTO();
        dto.setProjectId(p.getProjectId());
        dto.setProjectName(p.getProjectName());
        dto.setDescription(p.getDescription());
        dto.setAllocatedBudget(p.getAllocatedBudget());
        dto.setProjectStatus(p.getProjectStatus());
        dto.setFeedback(p.getFeedback());
        dto.setDocumentId(p.getDocument() != null ? p.getDocument().getDocumentId() : null);
        return dto;
    }
}
