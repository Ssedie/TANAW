package com.crud.tanaw.controller.api;

import com.crud.tanaw.dto.ActivityDTO;
import com.crud.tanaw.entities.Activity;
import com.crud.tanaw.entities.Project;
import com.crud.tanaw.entities.User;
import com.crud.tanaw.repositories.ActivityRepository;
import com.crud.tanaw.repositories.ProjectRepository;
import com.crud.tanaw.repositories.UserRepository;
import com.crud.tanaw.utility.SecurityUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/activities")
public class ApiActivityController {

    private final ActivityRepository activityRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");

    public ApiActivityController(ActivityRepository activityRepository,
                                 ProjectRepository projectRepository,
                                 UserRepository userRepository) {
        this.activityRepository = activityRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/project/{projectId}")
    public List<ActivityDTO> getActivitiesByProject(@PathVariable Integer projectId) {
        return activityRepository.findByProjectProjectId(projectId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<?> addActivity(@RequestBody ActivityDTO dto, Authentication auth) {
        try {
            if (!SecurityUtil.isAdmin(auth)) {
                return ResponseEntity.status(403).body("Only admins can create activities.");
            }

            Project project = projectRepository.findById(dto.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found"));

            Integer projectHeadId = project.getUser().getUserId();
            User user = userRepository.findById(projectHeadId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Activity activity = new Activity();
            activity.setActivityName(dto.getActivityName());
            activity.setDescription(dto.getDescription());
            activity.setDate(formatter.parse(dto.getDate()));
            activity.setStatus(dto.getStatus());
            activity.setExpenses(dto.getExpenses());
            activity.setProject(project);
            activity.setProjectHead(user);
            activity.setType(dto.getType());

            Activity saved = activityRepository.save(activity);
            return ResponseEntity.ok(convertToDTO(saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating activity: " + e.getMessage());
        }
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

        return dto;
    }
}
