package com.HolosINC.Holos.reports;

import com.HolosINC.Holos.work.Work;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ReportDTO {
    
    private String name;

    private String description;
    
    private Long workId;

    private String reportType;

    public Report createReport(Work work, ReportType reportType) {
        return Report.builder()
                .name(this.name)
                .description(this.description)
                .work(work)
                .reportType(reportType)
                .build();
    }
}
