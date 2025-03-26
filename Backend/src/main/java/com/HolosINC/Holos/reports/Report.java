package com.HolosINC.Holos.reports;

import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.work.Work;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "reports")
@Data
public class Report {
    
    @Id
    @SequenceGenerator(name = "report_seq", sequenceName = "report_sequence", initialValue = 1, allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "report_seq")
    protected Long id;
    
    @Size(max = 50)
    @NotNull
    private String name;

    @Size(max = 255)
    @NotNull
    private String description;

    @Enumerated(EnumType.STRING)
    private ReportStatus status;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @Valid
    @NotNull
    @JsonIgnore
    private BaseUser madeBy;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @Valid
    @JsonIgnore
    private BaseUser reportedUser;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @Valid
    @JsonIgnore
    private Work work;

    @ManyToOne(fetch = FetchType.LAZY)
    @Valid
    @JsonIgnore
    private ReportType reportType;
}
