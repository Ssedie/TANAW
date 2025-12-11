package com.crud.tanaw.controller.api;

import com.crud.tanaw.dto.ActivityDTO;
import com.crud.tanaw.entities.Activity;
import com.crud.tanaw.entities.Project;
import com.crud.tanaw.entities.User;
import com.crud.tanaw.repositories.ActivityRepository;
import com.crud.tanaw.repositories.ProjectRepository;
import com.crud.tanaw.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/activities")
public class ApiActivityController {

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    private final SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");

    @GetMapping("/project/{projectId}")
    public List<ActivityDTO> getActivitiesByProject(@PathVariable Integer projectId) {
        return activityRepository.findByProjectProjectId(projectId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<?> addActivity(@RequestBody ActivityDTO dto) {
        try {
            Project project = projectRepository.findById(dto.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found"));
            User user = userRepository.findById(project.getUser().getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Activity activity = new Activity();
            activity.setActivityName(dto.getActivityName());
            activity.setDescription(dto.getDescription());
            activity.setDate(formatter.parse(dto.getDate()));
            activity.setStatus(dto.getStatus());
            activity.setExpenses(dto.getExpenses());
            activity.setProject(project);
            activity.setProjectHead(user);

            Activity saved = activityRepository.save(activity);
            return ResponseEntity.ok(convertToDTO(saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating activity: " + e.getMessage());
        }
    }

    private ActivityDTO convertToDTO(Activity a) {
        return new ActivityDTO(
                a.getActivityId(),
                a.getActivityName(),
                a.getDescription(),
                a.getDate(),
                a.getStatus(),
                a.getExpenses(),
                a.getProject().getProjectId()
        );
    }
}
