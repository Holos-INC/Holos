package com.HolosINC.Holos.reports;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.work.Work;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "reports")
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

    @NotNull
    private ReportStatus status;

    @ManyToOne(optional = false)
    @Valid
    @NotNull
    private BaseUser madeBy;

    @ManyToOne(optional = true)
    @Valid
    private Artist reportedUser;

    @ManyToOne(optional = true)
    @Valid
    private Work work;

    @ManyToOne
    @Valid
    private ReportType reportType;
}
