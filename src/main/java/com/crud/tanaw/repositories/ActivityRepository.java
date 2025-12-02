package com.crud.tanaw.repositories;

import com.crud.tanaw.entities.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Integer> {
    boolean existsByActivityId(Integer activityId);
    List<Activity> findByProjectProjectId(Integer projectId);
    List<Activity> findByProjectHeadUserId(Integer userId);
}
