package com.HolosINC.Holos.reports;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportTypeRepository extends JpaRepository<ReportType, Long> {
    @Query("select rt from ReportType rt where rt.type = :type")
    Optional<ReportType> findByType(String type);
}
