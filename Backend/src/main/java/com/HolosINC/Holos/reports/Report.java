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
import lombok.Builder;
import lombok.Data;

@Data
@Entity
@Builder
@Table(name = "reports")
public class Report {
    
    @Id
	@SequenceGenerator(name = "entity_seq", sequenceName = "entity_sequence", initialValue = 500)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "entity_seq")
    protected Long id;
    
    @Size(max = 50)
    @NotNull
    private String name;

    @Size(max = 255)
    @NotNull
    private String description;

    @NotNull
    private ReportStatus status;

    @OneToOne(optional = false)
    @Valid
    @NotNull
    private BaseUser madeBy;

    @OneToOne(optional = true)
    @Valid
    @NotNull
    private Artist reportedUser;

    @ManyToOne(optional = true)
    @Valid
    @NotNull
    private Work work;

    @ManyToOne
    @Valid
    @NotNull
    private ReportType reportType;
}
