package com.HolosINC.Holos.reports;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportTypeRepository extends JpaRepository<ReportType, Long> {
    @Query("SELECT rt FROM ReportType rt WHERE rt.type = :type")
    List<ReportType> findAllByType(String type);

}
