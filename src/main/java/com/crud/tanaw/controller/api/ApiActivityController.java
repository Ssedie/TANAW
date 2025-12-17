package com.crud.tanaw.controller.api;

import com.crud.tanaw.dto.ActivityDTO;
import com.crud.tanaw.entities.Activity;
import com.crud.tanaw.entities.Project;
import com.crud.tanaw.entities.User;
import com.crud.tanaw.repositories.ActivityRepository;
import com.crud.tanaw.repositories.ProjectRepository;
import com.crud.tanaw.repositories.UserRepository;
import com.crud.tanaw.services.ActivityService;
import com.crud.tanaw.utility.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
public class ApiActivityController {

    private final ActivityService activityService;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ActivityRepository activityRepository;
    private final SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");

    @GetMapping
    public ResponseEntity<List<Activity>> getAllActivities() {
        return ResponseEntity.ok(activityService.getAllActivities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Activity> getActivityById(@PathVariable Integer id) {
        return ResponseEntity.ok(activityService.getActivityById(id));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Activity>> getActivitiesByProject(@PathVariable Integer projectId) {
        return ResponseEntity.ok(activityService.getActivitiesByProject(projectId));
    }

    @PostMapping
    public ResponseEntity<?> addActivity(
            @RequestParam("activityName") String activityName,
            @RequestParam("description") String description,
            @RequestParam("date") String date,
            @RequestParam(value = "status", defaultValue = "ONGOING") String status,
            @RequestParam(value = "expenses", defaultValue = "0") Double expenses,
            @RequestParam("projectId") Integer projectId,
            @RequestParam("type") String type,
            Authentication auth)
    {
        try{
            if (!SecurityUtil.isAdmin(auth)) {
                return ResponseEntity.status(403).body("Only admins can create activities.");
            }

            Project project = projectRepository.findById(projectId)
                    .orElseThrow(() -> new RuntimeException("Project not found"));

            User user = project.getUser(); // project head

            Activity activity = new Activity();
            activity.setActivityName(activityName);
            activity.setDescription(description);
            activity.setDate(formatter.parse(date));
            activity.setStatus(status);
            activity.setExpenses(expenses);
            activity.setProject(project);
            activity.setProjectHead(user);
            activity.setType(type);
            Activity saved = activityRepository.save(activity);
            return ResponseEntity.ok(convertToDTO(saved));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error creating activity: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateActivity(
            @PathVariable Integer id,
            @RequestBody Activity activity
    ) {
        try {
            Activity existing = activityService.getActivityById(id);

            // Update fields
            if (activity.getActivityName() != null) {
                existing.setActivityName(activity.getActivityName());
            }
            if (activity.getDescription() != null) {
                existing.setDescription(activity.getDescription());
            }
            if (activity.getDate() != null) {
                existing.setDate(activity.getDate());
            }
            if (activity.getStatus() != null) {
                existing.setStatus(activity.getStatus());
            }
            if (activity.getExpenses() != null) {
                existing.setExpenses(activity.getExpenses());
            }
            if (activity.getType() != null) {
                existing.setType(activity.getType());
            }

            // Save and automatically update budget expenses
            Activity updated = activityService.saveActivity(existing);

            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Failed to update activity: " + e.getMessage()));
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
        dto.setType(a.getType());// Make sure this is included!

        return dto;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteActivity(@PathVariable Integer id) {
        try {
            // Delete activity and automatically update budget expenses
            activityService.deleteActivity(id);
            return ResponseEntity.ok(Map.of("message", "Activity deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Failed to delete activity: " + e.getMessage()));
        }
    }
}