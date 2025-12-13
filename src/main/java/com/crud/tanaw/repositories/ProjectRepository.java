package com.crud.tanaw.repositories;

import com.crud.tanaw.entities.Document;
import com.crud.tanaw.entities.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Integer> {
    boolean existsByProjectId(Integer projectId);
    List<Project> findByUserUserId(Integer userId);

    Long countByProjectStatus(String status);

    List<Project> findByDocument(Document document);

    @Query("SELECT COUNT(p) FROM Project p WHERE p.endDate >= ?1")
    Long countOnTime(Date today);

    @Query("SELECT COUNT(p) FROM Project p WHERE p.endDate < ?1")
    Long countDelayed(Date today);

    // Custom projection - fetch main fields and compute progress from activities expense ratio if available
    // This query returns project basic data; progress computation will be done in service
    @Query("SELECT p FROM Project p")
    List<Project> findAllProjectsForDashboard();
}
