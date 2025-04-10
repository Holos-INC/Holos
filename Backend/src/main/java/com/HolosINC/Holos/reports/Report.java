package com.HolosINC.Holos.reports;

import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.work.Work;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "reports")
@Data
@AllArgsConstructor
@NoArgsConstructor
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

    @Enumerated(EnumType.STRING)
    private ReportStatus status;

    @ManyToOne(optional = false)
    @Valid
    @NotNull
    private BaseUser madeBy;

    @ManyToOne(optional = true)
    @Valid
    @NotNull
    private BaseUser reportedUser;

    @ManyToOne(optional = true)
    @Valid
    @NotNull
    private Work work;

    @ManyToOne
    @Valid
    @NotNull
    private ReportType reportType;
}
