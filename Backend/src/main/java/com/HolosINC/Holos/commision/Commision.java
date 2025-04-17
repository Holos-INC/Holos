package com.HolosINC.Holos.commision;

import java.util.Date;

import com.HolosINC.Holos.Kanban.StatusKanbanOrder;
import com.HolosINC.Holos.client.Client;
import com.HolosINC.Holos.work.Work;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
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

    @Temporal(TemporalType.DATE)
    private Date acceptedDateByArtist;

    @Enumerated(EnumType.STRING)
    private EnumPaymentArrangement paymentArrangement;

    @Temporal(TemporalType.DATE)
    private Date milestoneDate;

    private Integer totalPayments;

    private Integer currentPayments;

    private boolean isWaitingPayment;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "status_kanban_order_id", referencedColumnName = "id")
    private StatusKanbanOrder statusKanbanOrder;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "client_id", referencedColumnName = "id", nullable = false)
    private Client client;

    @PrePersist
    private void prePersist() {
        initializeInitialState();
    }
    
    @PreUpdate
    private void preUpdate() {
        initializeInitialState();
    }

    private void initializeInitialState() {
        switch (paymentArrangement) {
            case INITIAL:
                this.isWaitingPayment = true;   
                this.totalPayments = 1;
                break;
            case FINAL:
                this.isWaitingPayment = false;
                this.totalPayments = 1;
                break;
            case FIFTYFIFTY:
                this.isWaitingPayment = true;
                this.totalPayments = 2;
                break;
            case MODERATOR:
                if (this.totalPayments < 3) {
                    throw new IllegalArgumentException("Debe proporcionar un número mayor o igual a 3 pagos para el arreglo MODERATOR.");
                }
                this.isWaitingPayment = true;
                this.setTotalPayments(this.getTotalPayments());
                break;
            default:
                throw new IllegalStateException("Tipo de pago no reconocido: " + this.paymentArrangement);
        }
    }
    
}