package com.crud.tanaw.services;

import com.crud.tanaw.entities.Activity;
import com.crud.tanaw.entities.Budget;
import com.crud.tanaw.entities.Project;
import com.crud.tanaw.repositories.ActivityRepository;
import com.crud.tanaw.repositories.BudgetRepository;
import com.crud.tanaw.repositories.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final ProjectRepository projectRepository;
    private final BudgetRepository budgetRepository;

    /**
     * Save or update an activity and recalculate budget expenses
     */
    @Transactional
    public Activity saveActivity(Activity activity) {
        Activity saved = activityRepository.save(activity);

        // Recalculate budget total expenses for the fiscal year
        if (saved.getProject() != null && saved.getProject().getBudget() != null) {
            updateBudgetExpenses(saved.getProject().getBudget());
        }

        return saved;
    }

    /**
     * Delete an activity and recalculate budget expenses
     */
    @Transactional
    public void deleteActivity(Integer activityId) {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("Activity not found"));

        Budget budget = null;
        if (activity.getProject() != null && activity.getProject().getBudget() != null) {
            budget = activity.getProject().getBudget();
        }

        activityRepository.deleteById(activityId);

        // Recalculate budget total expenses after deletion
        if (budget != null) {
            updateBudgetExpenses(budget);
        }
    }

    /**
     * Recalculate and update the totalExpenses for a budget based on all activities
     * in projects linked to that budget
     */
    @Transactional
    public void updateBudgetExpenses(Budget budget) {
        // Get all projects for this budget
        List<Project> projects = projectRepository.findByBudgetId(budget.getBudgetId());

        // Sum all activity expenses across all projects
        Double totalExpenses = 0.0;
        for (Project project : projects) {
            List<Activity> activities = activityRepository.findByProjectProjectId(project.getProjectId());
            for (Activity activity : activities) {
                if (activity.getExpenses() != null) {
                    totalExpenses += activity.getExpenses();
                }
            }
        }

        // Update budget
        budget.setTotalExpenses(totalExpenses);
        budgetRepository.save(budget);
    }

    /**
     * Get all activities for a project
     */
    public List<Activity> getActivitiesByProject(Integer projectId) {
        return activityRepository.findByProjectProjectId(projectId);
    }

    /**
     * Get all activities
     */
    public List<Activity> getAllActivities() {
        return activityRepository.findAll();
    }

    /**
     * Get activity by ID
     */
    public Activity getActivityById(Integer activityId) {
        return activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("Activity not found with id: " + activityId));
    }
}