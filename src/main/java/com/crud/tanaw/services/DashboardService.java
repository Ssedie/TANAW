package com.crud.tanaw.services;

import com.crud.tanaw.dto.ActivityDTO;
import com.crud.tanaw.dto.dashboardDTO.BudgetDistributionDTO;
import com.crud.tanaw.dto.dashboardDTO.DashboardOverviewDTO;
import com.crud.tanaw.dto.dashboardDTO.FeedbackSummaryDTO;
import com.crud.tanaw.dto.dashboardDTO.ProjectStatusDTO;
import com.crud.tanaw.entities.Activity;
import com.crud.tanaw.entities.Budget;
import com.crud.tanaw.entities.Feedback;
import com.crud.tanaw.entities.Project;
import com.crud.tanaw.repositories.ActivityRepository;
import com.crud.tanaw.repositories.BudgetRepository;
import com.crud.tanaw.repositories.FeedbackRepository;
import com.crud.tanaw.repositories.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final BudgetRepository budgetRepo;
    private final ProjectRepository projectRepo;
    private final ActivityRepository activityRepo;
    private final FeedbackRepository feedbackRepo;

    public DashboardService(BudgetRepository budgetRepo,
                            ProjectRepository projectRepo,
                            ActivityRepository activityRepo,
                            FeedbackRepository feedbackRepo) {
        this.budgetRepo = budgetRepo;
        this.projectRepo = projectRepo;
        this.activityRepo = activityRepo;
        this.feedbackRepo = feedbackRepo;
    }

    public DashboardOverviewDTO getOverview() {
        Budget budget = budgetRepo.findTopByOrderByUploadDateDesc();

        Double totalBudget = Optional.ofNullable(budgetRepo.sumApprovedBudget()).orElse(0.0);
        Double totalSpent = Optional.ofNullable(activityRepo.sumAllExpenses()).orElse(0.0);
        Long activeProjects = Optional.ofNullable(projectRepo.countByProjectStatus("Active")).orElse(0L);

        Date now = new Date();
        Long onTime = Optional.ofNullable(projectRepo.countOnTime(now)).orElse(0L);
        Long delayed = Optional.ofNullable(projectRepo.countDelayed(now)).orElse(0L);

        Long feedbackCount = Optional.ofNullable(feedbackRepo.totalFeedbackCount()).orElse(0L);

        return new DashboardOverviewDTO(totalBudget, totalSpent, activeProjects, onTime, delayed, feedbackCount);
    }

    public List<BudgetDistributionDTO> getBudgetDistribution() {
        return budgetRepo.findBudgetDistributionByDocumentType();
    }

    public List<ProjectStatusDTO> getProjectStatusList() {
        List<Project> projects = projectRepo.findAllProjectsForDashboard();
        List<ProjectStatusDTO> out = new ArrayList<>();
        DateTimeFormatter fmt = DateTimeFormatter.ISO_LOCAL_DATE;

        for (Project p : projects) {
            ProjectStatusDTO dto = new ProjectStatusDTO();
            dto.setProjectId(p.getProjectId());
            dto.setProjectName(p.getProjectName());

            // allocatedBudget is String in your entity -- try to parse to double
            Double allocated = 0.0;
            try {
                allocated = Double.parseDouble(Optional.ofNullable(p.getAllocatedBudget()).orElse("0").replaceAll("[^0-9.]", ""));
            } catch (Exception ignored) {}
            dto.setAllocatedBudget(allocated);

            // Calculate spentBudget by looking up budgets linked to the project's document if any
            Double spent = 0.0;
            if (p.getDocument() != null && p.getDocument().getBudgets() != null) {
                for (Budget b : p.getDocument().getBudgets()) {
                    if (b.getTotalExpenses() != null) spent += b.getTotalExpenses();
                }
            }
            dto.setSpentBudget(spent);

            // progress estimation: if allocated > 0, progress = min(100, (spent/allocated)*100), else try based on dates
            double progress = 0;
            if (allocated > 0) {
                progress = Math.min(100, Math.round((spent / allocated) * 100));
            } else if (p.getStartDate() != null && p.getEndDate() != null) {
                long total = p.getEndDate().getTime() - p.getStartDate().getTime();
                long passed = new Date().getTime() - p.getStartDate().getTime();
                if (total > 0) progress = Math.max(0, Math.min(100, Math.round((double) passed / total * 100)));
            } else {
                progress = 0.0;
            }
            dto.setProgress(progress);

            dto.setStatus(p.getProjectStatus());
            if (p.getEndDate() != null) {
                dto.setDueDate(p.getEndDate());
            } else {
                dto.setDueDate(null);
            }
            out.add(dto);
        }

        return out;
    }

    public List<ActivityDTO> getRecentActivities() {
        List<ActivityDTO> out = new ArrayList<>();
        DateTimeFormatter fmt = DateTimeFormatter.ISO_OFFSET_DATE_TIME;
        List<Activity> acts = activityRepo.findRecentActivities();
        for (Activity a : acts) {
            ActivityDTO dto = new ActivityDTO();
            dto.setActivityId(a.getActivityId());
            dto.setActivityName(a.getActivityName());
            dto.setDescription(a.getDescription());
            dto.setStatus(a.getStatus());
            dto.setExpenses(a.getExpenses());
            if (a.getDate() != null) dto.setDate(a.getDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate().toString());
            if (a.getProject() != null) {
                dto.setProjectId(a.getProject().getProjectId());
                dto.setProjectName(a.getProject().getProjectName());
            }
            out.add(dto);
        }
        return out;
    }

    public List<FeedbackSummaryDTO> getFeedbackSummaryByProject() {
        return feedbackRepo.findFeedbackCountsByProject();
    }

    public List<Feedback> getFeedbacksForProject(Integer projectId) {
        return feedbackRepo.findByProjectIdOrderByUploadDateDesc(projectId);
    }
}
