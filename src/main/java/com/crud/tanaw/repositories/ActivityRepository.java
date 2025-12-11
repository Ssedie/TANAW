package com.crud.tanaw.repositories;

import com.crud.tanaw.entities.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Integer> {
    boolean existsByActivityId(Integer activityId);
    List<Activity> findByProjectProjectId(Integer projectId);
    List<Activity> findByProjectHeadUserId(Integer userId);

    @Query("SELECT COALESCE(SUM(a.expenses), 0) FROM Activity a")
    Double sumAllExpenses();

    @Query("SELECT a FROM Activity a ORDER BY a.date DESC")
    List<Activity> findRecentActivities();
}
