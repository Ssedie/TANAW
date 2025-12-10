package com.crud.tanaw.controller.api;

import com.crud.tanaw.dto.dashboardDTO.BudgetSummaryDTO;
import com.crud.tanaw.dto.dashboardDTO.ProjectFeedbackDTO;
import com.crud.tanaw.dto.dashboardDTO.ProjectsByStatusDTO;
import com.crud.tanaw.dto.dashboardDTO.UsersByStatusDTO;
import com.crud.tanaw.entities.Project;
import com.crud.tanaw.repositories.DashboardRepository;
import com.crud.tanaw.repositories.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class ApiDashboardController {

    private final DashboardRepository dashboardRepository;
    private final ProjectRepository projectRepository;

    @GetMapping("/users-by-status")
    public List<UsersByStatusDTO> getUsersByStatus() {
        return dashboardRepository.countUsersByStatus();
    }

    @GetMapping("/projects-by-status")
    public List<ProjectsByStatusDTO> getProjectsByStatus() {
        return dashboardRepository.countProjectsByStatus();
    }

    @GetMapping("/project-feedback")
    public List<ProjectFeedbackDTO> getProjectFeedbackCount() {
        return dashboardRepository.projectFeedbackCount();
    }

    @GetMapping("/feedbacks/{projectId}")
    public List<?> getFeedbacksByProject(@PathVariable Integer projectId) {
        return dashboardRepository.findFeedbacksWithRepliesByProject(projectId);
    }

    @GetMapping("/budget-summary")
    public ResponseEntity<?> getBudgetSummary() {
        List<Project> projects = projectRepository.findAll();

        // Sum budgets by status
        Map<String, Double> summary = new HashMap<>();
        summary.put("ONGOING", projects.stream()
                .filter(p -> "ONGOING".equals(p.getProjectStatus()))
                .mapToDouble(p -> Double.parseDouble(p.getAllocatedBudget()))
                .sum());
        summary.put("COMPLETED", projects.stream()
                .filter(p -> "COMPLETED".equals(p.getProjectStatus()))
                .mapToDouble(p -> Double.parseDouble(p.getAllocatedBudget()))
                .sum());
        summary.put("CANCELLED", projects.stream()
                .filter(p -> "CANCELLED".equals(p.getProjectStatus()))
                .mapToDouble(p -> Double.parseDouble(p.getAllocatedBudget()))
                .sum());

        return ResponseEntity.ok(summary);
    }
}
