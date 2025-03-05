package com.HolosINC.Holos.commision;

import java.util.Date;

import com.HolosINC.Holos.Kanban.StatusKanbanOrder;
import com.HolosINC.Holos.work.Work;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "commisions")
@Data
@EqualsAndHashCode(callSuper = true)
public class Commision extends Work{

    @Enumerated(EnumType.STRING)
    private StatusCommision status;

    private Integer numMilestones;

    @Temporal(TemporalType.DATE)
    private Date acceptedDateByArtist;

    @Enumerated(EnumType.STRING)
    private EnumPaymentArrangement paymentArrangement;

    @ManyToOne
    @JoinColumn(name = "status_kanban_order_id")
    private StatusKanbanOrder statusKanbanOrder;
    
    // @OneToMany(mappedBy = "commision", cascade = CascadeType.ALL, orphanRemoval = true)
    // private List<Milestones> milestones;
}
