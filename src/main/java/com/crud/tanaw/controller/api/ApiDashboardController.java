package com.crud.tanaw.controller.api;

import com.crud.tanaw.repositories.ActivityRepository;
import com.crud.tanaw.repositories.BudgetRepository;
import com.crud.tanaw.repositories.ProjectRepository;
import com.crud.tanaw.services.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.Year;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")

public class ApiDashboardController {

    private final DashboardService dashboardService;
    private final ProjectRepository projectRepository;
    private final BudgetRepository budgetRepository;
    private final ActivityRepository activityRepository;

    public ApiDashboardController(DashboardService dashboardService, ProjectRepository projectRepository, BudgetRepository budgetRepository, ActivityRepository activityRepository) {
        this.dashboardService = dashboardService;
        this.projectRepository = projectRepository;
        this.budgetRepository = budgetRepository;
        this.activityRepository = activityRepository;
    }
    /**
     * Get current fiscal year
     */
    @GetMapping("/fiscal-year/current")
    public ResponseEntity<Map<String, Object>> getCurrentFiscalYear() {
        Map<String, Object> response = new HashMap<>();
        String currentYear = Year.now().toString();
        response.put("currentFiscalYear", currentYear);
        response.put("currentYear", currentYear);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all available fiscal years
     */
    @GetMapping("/fiscal-years/available")
    public ResponseEntity<List<String>> getAvailableFiscalYears() {
        List<String> fiscalYears = budgetRepository.findAll()
                .stream()
                .map(b -> b.getFiscalYear())
                .distinct()
                .sorted(Comparator.reverseOrder())
                .collect(Collectors.toList());

        return ResponseEntity.ok(fiscalYears);
    }

    /**
     * Get dashboard overview for a specific fiscal year
     */
    @GetMapping("/overview")
    public ResponseEntity<Map<String, Object>> getOverview(
            @RequestParam(required = false) String fiscalYear
    ) {
        if (fiscalYear == null || fiscalYear.isEmpty()) {
            fiscalYear = String.valueOf(LocalDate.now().getYear());
        }

        // Get total budget for fiscal year
        Double totalBudget = budgetRepository.findByFiscalYear(fiscalYear)
                .stream()
                .mapToDouble(b -> b.getTotalBudget() != null ? b.getTotalBudget() : 0)
                .sum();

        // Get total spent for fiscal year (from activities)
        Double totalSpent = projectRepository.sumExpensesByFiscalYear(fiscalYear);
        if (totalSpent == null) totalSpent = 0.0;

        // Count active projects
        Long activeProjects = projectRepository.countActiveProjectsByFiscalYear(fiscalYear);

        Map<String, Object> overview = new HashMap<>();
        overview.put("fiscalYear", fiscalYear);
        overview.put("totalBudget", totalBudget);
        overview.put("totalSpent", totalSpent);
        overview.put("totalAvailable", totalBudget - totalSpent);
        overview.put("activeProjects", activeProjects);
        overview.put("spendingPercentage", totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0);

        return ResponseEntity.ok(overview);
    }

    /**
     * Get budget distribution by PROJECT TYPE for a fiscal year
     * This groups projects by their type (Infrastructure, Education, etc.)
     */
    @GetMapping("/budget-distribution")
    public ResponseEntity<List<Map<String, Object>>> getBudgetDistribution(
            @RequestParam(required = false) String fiscalYear
    ) {
        if (fiscalYear == null || fiscalYear.isEmpty()) {
            fiscalYear = String.valueOf(LocalDate.now().getYear());
        }

        String targetFiscalYear = fiscalYear;

        // Get all projects for this fiscal year
        List<Map<String, Object>> distribution = projectRepository.findByBudget_FiscalYear(targetFiscalYear)
                .stream()
                .collect(Collectors.groupingBy(
                        project -> project.getProjectType() != null ? project.getProjectType() : "GENERAL",
                        Collectors.summingDouble(project -> project.getAllocatedBudget() != null ? project.getAllocatedBudget() : 0)
                ))
                .entrySet()
                .stream()
                .map(entry -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("projectType", entry.getKey());
                    item.put("totalBudget", entry.getValue());
                    item.put("fiscalYear", targetFiscalYear);
                    return item;
                })
                .sorted((a, b) -> Double.compare(
                        (Double) b.get("totalBudget"),
                        (Double) a.get("totalBudget")
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(distribution);
    }

    /**
     * Get budget distribution by PROJECT TYPE with spending details
     * Shows allocated vs spent for each project type
     */
    @GetMapping("/budget-distribution-detailed")
    public ResponseEntity<List<Map<String, Object>>> getBudgetDistributionDetailed(
            @RequestParam(required = false) String fiscalYear
    ) {
        if (fiscalYear == null || fiscalYear.isEmpty()) {
            fiscalYear = String.valueOf(LocalDate.now().getYear());
        }

        String targetFiscalYear = fiscalYear;

        // Group projects by type and calculate allocated + spent
        Map<String, Map<String, Double>> typeStats = new HashMap<>();

        projectRepository.findByBudget_FiscalYear(targetFiscalYear).forEach(project -> {
            String type = project.getProjectType() != null ? project.getProjectType() : "GENERAL";

            typeStats.putIfAbsent(type, new HashMap<>());
            Map<String, Double> stats = typeStats.get(type);

            // Add allocated budget
            Double allocated = stats.getOrDefault("allocated", 0.0);
            stats.put("allocated", allocated + (project.getAllocatedBudget() != null ? project.getAllocatedBudget() : 0));

            // Calculate spent from activities
            Double spent = stats.getOrDefault("spent", 0.0);
            if (project.getActivities() != null) {
                Double projectSpent = project.getActivities().stream()
                        .mapToDouble(a -> a.getExpenses() != null ? a.getExpenses() : 0)
                        .sum();
                stats.put("spent", spent + projectSpent);
            }
        });

        // Convert to list
        List<Map<String, Object>> distribution = typeStats.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> item = new HashMap<>();
                    String type = entry.getKey();
                    Double allocated = entry.getValue().get("allocated");
                    Double spent = entry.getValue().getOrDefault("spent", 0.0);

                    item.put("projectType", type);
                    item.put("totalAllocated", allocated);  // ✅ CHANGED FROM totalBudget
                    item.put("totalSpent", spent);
                    item.put("remaining", allocated - spent);
                    item.put("utilizationPercentage", allocated > 0 ? (spent / allocated) * 100 : 0);
                    item.put("fiscalYear", targetFiscalYear);
                    return item;
                })
                .sorted((a, b) -> Double.compare(
                        (Double) b.get("totalAllocated"),  // ✅ CHANGED FROM totalBudget
                        (Double) a.get("totalAllocated")   // ✅ CHANGED FROM totalBudget
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(distribution);
    }

    /**
     * Get recent activities for a fiscal year
     */
    @GetMapping("/activities")
    public ResponseEntity<List<Map<String, Object>>> getRecentActivities(
            @RequestParam(required = false) String fiscalYear,
            @RequestParam(defaultValue = "10") int limit
    ) {
        if (fiscalYear == null || fiscalYear.isEmpty()) {
            fiscalYear = String.valueOf(LocalDate.now().getYear());
        }

        String targetFiscalYear = fiscalYear;

        List<Map<String, Object>> activities = activityRepository.findAll()
                .stream()
                .filter(a -> a.getProject() != null &&
                        a.getProject().getBudget() != null &&
                        targetFiscalYear.equals(a.getProject().getBudget().getFiscalYear()))
                .sorted((a1, a2) -> a2.getDate().compareTo(a1.getDate()))
                .limit(limit)
                .map(a -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("activityId", a.getActivityId());
                    item.put("activityName", a.getActivityName());
                    item.put("description", a.getDescription());
                    item.put("date", a.getDate());
                    item.put("expenses", a.getExpenses());
                    item.put("type", a.getType());
                    item.put("projectName", a.getProject() != null ? a.getProject().getProjectName() : "Unknown");
                    item.put("projectId", a.getProject() != null ? a.getProject().getProjectId() : null);
                    item.put("projectType", a.getProject() != null ? a.getProject().getProjectType() : "GENERAL");
                    return item;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(activities);
    }

    /**
     * Get budget summary for ALL fiscal years (for historical comparison)
     */
    @GetMapping("/budget-summary-all-years")
    public ResponseEntity<List<Map<String, Object>>> getBudgetSummaryAllYears() {
        List<String> fiscalYears = budgetRepository.findAll()
                .stream()
                .map(b -> b.getFiscalYear())
                .distinct()
                .sorted()
                .collect(Collectors.toList());

        List<Map<String, Object>> summary = fiscalYears.stream()
                .map(year -> {
                    Double totalBudget = budgetRepository.findByFiscalYear(year)
                            .stream()
                            .mapToDouble(b -> b.getTotalBudget() != null ? b.getTotalBudget() : 0)
                            .sum();

                    Double totalSpent = projectRepository.sumExpensesByFiscalYear(year);
                    if (totalSpent == null) totalSpent = 0.0;

                    Map<String, Object> yearData = new HashMap<>();
                    yearData.put("fiscalYear", year);
                    yearData.put("totalBudget", totalBudget);
                    yearData.put("totalSpent", totalSpent);
                    yearData.put("remaining", totalBudget - totalSpent);
                    yearData.put("utilizationPercentage", totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0);

                    return yearData;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(summary);
    }

    /**
     * Get project type breakdown with project counts
     */
    @GetMapping("/project-type-summary")
    public ResponseEntity<List<Map<String, Object>>> getProjectTypeSummary(
            @RequestParam(required = false) String fiscalYear
    ) {
        if (fiscalYear == null || fiscalYear.isEmpty()) {
            fiscalYear = String.valueOf(LocalDate.now().getYear());
        }

        String targetFiscalYear = fiscalYear;

        Map<String, Map<String, Object>> typeSummary = new HashMap<>();

        projectRepository.findByBudget_FiscalYear(targetFiscalYear).forEach(project -> {
            String type = project.getProjectType() != null ? project.getProjectType() : "GENERAL";

            typeSummary.putIfAbsent(type, new HashMap<>());
            Map<String, Object> stats = typeSummary.get(type);

            // Count projects
            Integer count = (Integer) stats.getOrDefault("projectCount", 0);
            stats.put("projectCount", count + 1);

            // Sum allocated budget
            Double allocated = (Double) stats.getOrDefault("totalAllocated", 0.0);
            stats.put("totalAllocated", allocated + (project.getAllocatedBudget() != null ? project.getAllocatedBudget() : 0));

            // Sum spent
            Double spent = (Double) stats.getOrDefault("totalSpent", 0.0);
            if (project.getActivities() != null) {
                Double projectSpent = project.getActivities().stream()
                        .mapToDouble(a -> a.getExpenses() != null ? a.getExpenses() : 0)
                        .sum();
                stats.put("totalSpent", spent + projectSpent);
            }
        });

        List<Map<String, Object>> result = typeSummary.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("projectType", entry.getKey());
                    item.put("projectCount", entry.getValue().get("projectCount"));
                    item.put("totalAllocated", entry.getValue().get("totalAllocated"));
                    item.put("totalSpent", entry.getValue().getOrDefault("totalSpent", 0.0));

                    Double allocated = (Double) entry.getValue().get("totalAllocated");
                    Double spent = (Double) entry.getValue().getOrDefault("totalSpent", 0.0);
                    item.put("remaining", allocated - spent);
                    item.put("utilizationPercentage", allocated > 0 ? (spent / allocated) * 100 : 0);

                    return item;
                })
                .sorted((a, b) -> Double.compare(
                        (Double) b.get("totalAllocated"),
                        (Double) a.get("totalAllocated")
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @GetMapping("/spending-by-type")
    public ResponseEntity<List<Map<String, Object>>> getSpendingByType(
            @RequestParam(required = false) String fiscalYear
    ) {
        String targetFiscalYear =
                (fiscalYear == null || fiscalYear.isEmpty())
                        ? String.valueOf(LocalDate.now().getYear())
                        : fiscalYear;

        List<Map<String, Object>> result =
                projectRepository.sumSpendingByProjectType(targetFiscalYear)
                        .stream()
                        .map(row -> {
                            Map<String, Object> item = new HashMap<>();
                            item.put("projectType", row[0]);
                            item.put("totalSpent", ((Number) row[1]).doubleValue());
                            item.put("fiscalYear", targetFiscalYear); // ✅ SAFE
                            return item;
                        })
                        .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }


    /**
     * Get project status list filtered by fiscal year
     */
    @GetMapping("/project-status")
    public ResponseEntity<?> getProjectStatus(
            @RequestParam(required = false) String fiscalYear
    ) {
        if (fiscalYear == null || fiscalYear.isEmpty()) {
            fiscalYear = String.valueOf(LocalDate.now().getYear());
        }

        return ResponseEntity.ok(dashboardService.getProjectStatusListByFiscalYear(fiscalYear));
    }
}