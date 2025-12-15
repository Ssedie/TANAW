package com.crud.tanaw.services;

import com.crud.tanaw.dto.dashboardDTO.ProjectStatusDTO;
import com.crud.tanaw.entities.Project;
import com.crud.tanaw.repositories.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private ProjectRepository projectRepository;

    /**
     * Get project status list for all projects
     */
    public List<ProjectStatusDTO> getProjectStatusList() {
        List<Project> projects = projectRepository.findAll();
        return projects.stream()
                .map(this::convertToProjectStatusDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get project status list filtered by fiscal year
     */
    public List<ProjectStatusDTO> getProjectStatusListByFiscalYear(String fiscalYear) {
        List<Project> projects = projectRepository.findByFiscalYear(fiscalYear);
        return projects.stream()
                .map(this::convertToProjectStatusDTO)
                .collect(Collectors.toList());
    }

    /**
     * Convert Project entity to ProjectStatusDTO
     */
    private ProjectStatusDTO convertToProjectStatusDTO(Project project) {
        ProjectStatusDTO dto = new ProjectStatusDTO();
        dto.setProjectId(project.getProjectId());
        dto.setProjectName(project.getProjectName());
        dto.setStatus(project.getProjectStatus());
        dto.setAllocatedBudget(project.getAllocatedBudget());

        // Calculate spent amount from activities
        double spent = (project.getActivities() != null) ?
                project.getActivities().stream()
                        .mapToDouble(a -> a.getExpenses() != null ? a.getExpenses() : 0)
                        .sum() : 0;

        dto.setSpentBudget(spent);
        dto.setRemainingBudget(project.getAllocatedBudget() - spent);

        return dto;
    }
}