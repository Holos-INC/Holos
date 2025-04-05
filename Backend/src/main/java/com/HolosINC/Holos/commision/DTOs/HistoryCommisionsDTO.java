package com.HolosINC.Holos.commision.DTOs;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class HistoryCommisionsDTO {
    
    private List<CommissionDTO> requested;

    private List<ClientCommissionDTO> accepted;

    private List<CommissionDTO> history;

    private String error;
}
