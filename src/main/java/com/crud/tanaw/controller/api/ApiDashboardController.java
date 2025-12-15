package com.crud.tanaw.controller.api;

import com.crud.tanaw.dto.ActivityDTO;
import com.crud.tanaw.dto.dashboardDTO.*;
import com.crud.tanaw.entities.Project;
import com.crud.tanaw.repositories.BudgetRepository;
import com.crud.tanaw.repositories.DashboardRepository;
import com.crud.tanaw.repositories.DocumentRepository;
import com.crud.tanaw.repositories.ProjectRepository;
import com.crud.tanaw.services.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Year;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class ApiDashboardController {

    private final DashboardRepository dashboardRepository;
    private final DashboardService dashboardService;
    private final ProjectRepository projectRepository;
    private final DocumentRepository documentRepository;
    private final BudgetRepository budgetRepository;

    // --- Get current fiscal year ---
    @GetMapping("/fiscal-year/current")
    public ResponseEntity<Map<String, Object>> getCurrentFiscalYear() {
        Map<String, Object> response = new HashMap<>();
        String currentYear = Year.now().toString();
        response.put("currentFiscalYear", currentYear);
        response.put("currentYear", currentYear);
        return ResponseEntity.ok(response);
    }

    // --- Get all available fiscal years ---
    @GetMapping("/fiscal-years/available")
    public ResponseEntity<List<String>> getAvailableFiscalYears() {
        List<String> fiscalYears = budgetRepository.findDistinctFiscalYears();
        return ResponseEntity.ok(fiscalYears);
    }

    // --- Users by status ---
    @GetMapping("/users-by-status")
    public List<UsersByStatusDTO> getUsersByStatus() {
        return dashboardRepository.countUsersByStatus();
    }

    // --- Dashboard overview (total budgets, project counts, etc) ---
    @GetMapping("/overview")
    public ResponseEntity<DashboardOverviewDTO> getOverview(
            @RequestParam(required = false) String fiscalYear
    ) {
        Date today = new Date();

        // If no fiscal year provided, use current year
        if (fiscalYear == null) {
            fiscalYear = Year.now().toString();
        }

        // Get totals for the specified fiscal year
        Double totalBudget = dashboardRepository.sumApprovedBudgetByFiscalYear(fiscalYear);
        Double totalSpent = dashboardRepository.sumTotalExpensesByFiscalYear(fiscalYear);

        // Get project counts (can be filtered by fiscal year if needed)
        Long activeProjects = projectRepository.countByFiscalYear(fiscalYear);
        Long onTimeProjects = projectRepository.countOnTime(today);
        Long delayedProjects = projectRepository.countDelayed(today);
        Long feedbackCount = dashboardRepository.countAllFeedbacks();

        DashboardOverviewDTO overview = new DashboardOverviewDTO(
                totalBudget != null ? totalBudget : 0,
                totalSpent != null ? totalSpent : 0,
                activeProjects,
                onTimeProjects,
                delayedProjects,
                feedbackCount
        );

        return ResponseEntity.ok(overview);
    }

    // --- Budget distribution by sector/document ---
    @GetMapping("/budget-distribution")
    public ResponseEntity<List<BudgetDistributionDTO>> getBudgetDistribution(
            @RequestParam(required = false) String fiscalYear
    ) {
        List<BudgetDistributionDTO> distribution;

        if (fiscalYear != null) {
            List<Object[]> rawData = dashboardRepository.findBudgetDistributionByDocumentTypeAndFiscalYear(fiscalYear);
            distribution = rawData.stream().map(row ->
                    new BudgetDistributionDTO((String) row[0], ((Number) row[1]).doubleValue())
            ).collect(Collectors.toList());
        } else {
            distribution = dashboardRepository.findBudgetDistributionByDocumentType();
        }

        return ResponseEntity.ok(distribution);
    }

    // --- Projects status table ---
    @GetMapping("/project-status")
    public ResponseEntity<List<ProjectStatusDTO>> getProjectStatus(
            @RequestParam(required = false) String fiscalYear
    ) {
        List<ProjectStatusDTO> status;

        if (fiscalYear != null) {
            status = dashboardService.getProjectStatusListByFiscalYear(fiscalYear);
        } else {
            status = dashboardService.getProjectStatusList();
        }

        return ResponseEntity.ok(status);
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

    // --- Activities ---
    @GetMapping("/activities")
    public List<ActivityDTO> getRecentActivities() {
        return dashboardRepository.findRecentActivities();
    }

    // --- Get total budget by fiscal year ---
    @GetMapping("/total-budget")
    public ResponseEntity<Map<String, Object>> getTotalBudget(
            @RequestParam(required = false) String fiscalYear
    ) {
        Map<String, Object> response = new HashMap<>();

        if (fiscalYear == null) {
            fiscalYear = Year.now().toString();
        }

        Double totalBudget = dashboardRepository.sumApprovedBudgetByFiscalYear(fiscalYear);
        response.put("fiscalYear", fiscalYear);
        response.put("totalBudget", totalBudget != null ? totalBudget : 0.0);

        return ResponseEntity.ok(response);
    }

    // --- Get budget summary for all fiscal years ---
    @GetMapping("/budget-summary-all-years")
    public ResponseEntity<List<Map<String, Object>>> getBudgetSummaryAllYears() {
        List<String> fiscalYears = budgetRepository.findDistinctFiscalYears();
        List<Map<String, Object>> summary = fiscalYears.stream().map(year -> {
            Map<String, Object> yearInfo = new HashMap<>();
            Double totalBudget = dashboardRepository.sumApprovedBudgetByFiscalYear(year);
            Double totalSpent = dashboardRepository.sumTotalExpensesByFiscalYear(year);

            yearInfo.put("fiscalYear", year);
            yearInfo.put("totalBudget", totalBudget != null ? totalBudget : 0.0);
            yearInfo.put("totalSpent", totalSpent != null ? totalSpent : 0.0);
            yearInfo.put("remaining", (totalBudget != null ? totalBudget : 0.0) - (totalSpent != null ? totalSpent : 0.0));

            return yearInfo;
        }).toList();

        return ResponseEntity.ok(summary);
    }
}