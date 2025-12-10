package com.crud.tanaw.controller.api;

import com.crud.tanaw.dto.ActivityDTO;
import com.crud.tanaw.dto.dashboardDTO.*;
import com.crud.tanaw.entities.Project;
import com.crud.tanaw.repositories.DashboardRepository;
import com.crud.tanaw.repositories.ProjectRepository;
import com.crud.tanaw.services.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class ApiDashboardController {

    private final DashboardRepository dashboardRepository;
    private final DashboardService dashboardService;
    private final ProjectRepository projectRepository;

    // --- Users by status ---
    @GetMapping("/users-by-status")
    public List<UsersByStatusDTO> getUsersByStatus() {
        return dashboardRepository.countUsersByStatus();
    }

    // --- Dashboard overview (total budgets, project counts, etc) ---
    @GetMapping("/overview")
    public ResponseEntity<DashboardOverviewDTO> getOverview() {
        Date today = new Date();
        Double totalBudget = dashboardRepository.sumApprovedBudget();
        Double totalSpent = dashboardRepository.sumTotalExpenses();
        Long activeProjects = projectRepository.count();
        Long onTimeProjects = projectRepository.countOnTime(today);
        Long delayedProjects = projectRepository.countDelayed(today);
        Long feedbackCount = dashboardRepository.countAllFeedbacks();

        DashboardOverviewDTO overview = new DashboardOverviewDTO(
                totalBudget,
                totalSpent,
                activeProjects,
                onTimeProjects,
                delayedProjects,
                feedbackCount
        );

        return ResponseEntity.ok(overview);
    }

    // --- Budget distribution by sector ---
    @GetMapping("/budget-distribution")
    public List<BudgetDistributionDTO> getBudgetDistribution() {
        return dashboardRepository.findBudgetDistributionByDocumentType();
    }

    // --- Projects status table ---
    @GetMapping("/project-status")
    public List<ProjectStatusDTO> getProjectStatus() {
        return dashboardService.getProjectStatusList();
    }


    // --- Feedback summary per project ---
    @GetMapping("/project-feedback")
    public List<FeedbackSummaryDTO> getProjectFeedbackCounts() {
        return dashboardRepository.findFeedbackSummary();
    }

    // --- Detailed feedbacks for a project ---
    @GetMapping("/feedbacks/{projectId}")
    public List<FeedbackWithRepliesDTO> getFeedbacksByProject(@PathVariable Integer projectId) {
        return dashboardRepository.findFeedbacksWithRepliesByProject(projectId);
    }

    // --- Optional: activities ---
    @GetMapping("/activities")
    public List<ActivityDTO> getRecentActivities() {
        return dashboardRepository.findRecentActivities();
    }
}
