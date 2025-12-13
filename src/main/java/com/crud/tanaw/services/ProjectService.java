package com.crud.tanaw.services;

import com.crud.tanaw.entities.Document;
import com.crud.tanaw.entities.Project;
import com.crud.tanaw.entities.User;
import com.crud.tanaw.repositories.ProjectRepository;
import com.crud.tanaw.repositories.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private DocumentRepository documentRepository;

    public List<Project> findAllProjects() {
        return projectRepository.findAll();
    }

    public List<Project> findByUserId(Integer userId) {
        return projectRepository.findByUserUserId(userId);
    }

    public Project createProject(String projectName, String description,
                                 String startDateStr, String endDateStr,
                                 Double allocatedBudget, String projectStatus,
                                 User user, MultipartFile file) {

        Project project = new Project();
        project.setProjectName(projectName);
        project.setDescription(description);
        project.setAllocatedBudget(allocatedBudget);
        project.setProjectStatus(projectStatus);
        project.setUser(user);

        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            project.setStartDate(sdf.parse(startDateStr));
            project.setEndDate(sdf.parse(endDateStr));
        } catch (Exception e) {
            e.printStackTrace();
        }

        if (file != null && !file.isEmpty()) {
            try {
                Document document = new Document();
                document.setDocumentTitle(file.getOriginalFilename());
                document.setDocumentType(file.getContentType());
                document.setContent("/uploads/" + UUID.randomUUID() + "_" + file.getOriginalFilename());
                document.setUploader(user);

                // Save document first
                documentRepository.save(document);

                // Associate document with project
                project.setDocument(document);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        return projectRepository.save(project);
    }

}
