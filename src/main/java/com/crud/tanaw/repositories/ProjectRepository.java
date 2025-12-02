package com.crud.tanaw.repositories;

import com.crud.tanaw.entities.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Integer> {
    boolean existsByProjectId(Integer projectId);
    List<Project> findByUserUserId(Integer userId);
}
