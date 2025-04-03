package com.HolosINC.Holos.milestone;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MilestoneRepository extends JpaRepository<Milestone, Long> {
    
    @Query("SELECT m FROM Milestone m WHERE m.commision.id = :id")
    List<Milestone> getByCommisionId(Long id);
    
    @Query("SELECT m FROM Milestone m WHERE m.commision.id = :commisionId")
    List<Milestone> findAllByCommisionId(@Param("commisionId") Long commisionId);
}
