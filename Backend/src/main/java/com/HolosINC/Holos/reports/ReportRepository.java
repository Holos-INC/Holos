package com.HolosINC.Holos.reports;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long>{
    
    @Query("SELECT COUNT(r) > 0 FROM Report r WHERE r.reportType.id = :reportTypeId")
    boolean isReportTypeInUse(@Param("reportTypeId") Long reportTypeId);

    boolean existsByMadeByIdAndWorkIdAndReportTypeId(Long madeById, Long workId, Long reportTypeId);
}
