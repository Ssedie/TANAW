package com.crud.tanaw.controller.api;

import com.crud.tanaw.dto.dashboardDTO.BudgetSummaryDTO;
import com.crud.tanaw.dto.dashboardDTO.ProjectFeedbackDTO;
import com.crud.tanaw.dto.dashboardDTO.ProjectsByStatusDTO;
import com.crud.tanaw.dto.dashboardDTO.UsersByStatusDTO;
import com.crud.tanaw.repositories.DashboardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class ApiDashboardController {

    private final DashboardRepository dashboardRepository;

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
    public List<BudgetSummaryDTO> getBudgetSummary() {
        return dashboardRepository.budgetSummary();
    }
}
