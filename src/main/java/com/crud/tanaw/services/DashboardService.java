package com.crud.tanaw.services;

import com.crud.tanaw.dto.dashboardDTO.ProjectStatusDTO;
import com.crud.tanaw.entities.Project;
import com.crud.tanaw.repositories.DashboardRepository;
import com.crud.tanaw.repositories.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private DashboardRepository dashboardRepository;

    /**
     * Get project status list for all projects
     */
    public List<ProjectStatusDTO> getProjectStatusList() {
        return dashboardRepository.findAllProjectStatus();
    }

    /**
     * Get project status list filtered by fiscal year
     */
    public List<ProjectStatusDTO> getProjectStatusListByFiscalYear(String fiscalYear) {
        return dashboardRepository.findAllProjectStatusByFiscalYear(fiscalYear);
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