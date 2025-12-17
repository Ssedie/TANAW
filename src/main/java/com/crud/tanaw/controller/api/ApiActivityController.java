package com.crud.tanaw.controller.api;

import com.crud.tanaw.dto.ActivityDTO;
import com.crud.tanaw.entities.Activity;
import com.crud.tanaw.entities.Project;
import com.crud.tanaw.entities.User;
import com.crud.tanaw.repositories.ActivityRepository;
import com.crud.tanaw.repositories.ProjectRepository;
import com.crud.tanaw.repositories.UserRepository;
import com.crud.tanaw.services.FileStorageService;
import com.crud.tanaw.utility.SecurityUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/activities")
public class ApiActivityController {

    private final ActivityRepository activityRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");

    @Value("${file.upload-dir:uploads/activities}")
    private String uploadDir;

    public ApiActivityController(ActivityRepository activityRepository,
                                 ProjectRepository projectRepository,
                                 UserRepository userRepository,
                                 FileStorageService fileStorageService) {
        this.activityRepository = activityRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping("/project/{projectId}")
    public List<ActivityDTO> getActivitiesByProject(@PathVariable Integer projectId) {
        return activityRepository.findByProjectProjectId(projectId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addActivity(
            @RequestParam("activityName") String activityName,
            @RequestParam("description") String description,
            @RequestParam("date") String date,
            @RequestParam(value = "status", defaultValue = "ONGOING") String status,
            @RequestParam(value = "expenses", defaultValue = "0") Double expenses,
            @RequestParam("projectId") Integer projectId,
            @RequestParam("type") String type,
            @RequestParam(value = "image", required = false) MultipartFile image,
            Authentication auth) {
        try {
            if (!SecurityUtil.isAdmin(auth)) {
                return ResponseEntity.status(403).body("Only admins can create activities.");
            }

            Project project = projectRepository.findById(projectId)
                    .orElseThrow(() -> new RuntimeException("Project not found"));

            Integer projectHeadId = project.getUser().getUserId();
            User user = userRepository.findById(projectHeadId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Handle image upload
            String imageUrl = null;
            if (image != null && !image.isEmpty()) {
                imageUrl = fileStorageService.saveFile(image, "activities");
            }

            Activity activity = new Activity();
            activity.setActivityName(activityName);
            activity.setDescription(description);
            activity.setDate(formatter.parse(date));
            activity.setStatus(status);
            activity.setExpenses(expenses);
            activity.setProject(project);
            activity.setProjectHead(user);
            activity.setType(type);
            activity.setImageUrl(imageUrl);

            Activity saved = activityRepository.save(activity);
            return ResponseEntity.ok(convertToDTO(saved));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error creating activity: " + e.getMessage());
        }
    }

    private String saveImage(MultipartFile file) throws IOException {
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

        // Save file
        Path filePath = uploadPath.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Return URL path (relative to your static resources)
        return "/uploads/activities/" + uniqueFilename;
    }

    private ActivityDTO convertToDTO(Activity a) {
        ActivityDTO dto = new ActivityDTO();

        dto.setActivityId(a.getActivityId());
        dto.setActivityName(a.getActivityName());
        dto.setDescription(a.getDescription());
        dto.setDate(a.getDate() != null ? formatter.format(a.getDate()) : null);
        dto.setStatus(a.getStatus());
        dto.setExpenses(a.getExpenses());
        dto.setProjectId(a.getProject().getProjectId());
        dto.setProjectName(a.getProject().getProjectName());
        dto.setType(a.getType());
        dto.setImageUrl(a.getImageUrl()); // Make sure this is included!

        return dto;
    }
}