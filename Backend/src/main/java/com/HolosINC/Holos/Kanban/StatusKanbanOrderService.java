package com.HolosINC.Holos.Kanban;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;

@Service
public class StatusKanbanOrderService {

    private StatusKanbanOrderRepository statusKanbanOrderRepository;

    @Autowired
    public StatusKanbanOrderService(StatusKanbanOrderRepository statusKanbanOrderRepository) {
        this.statusKanbanOrderRepository = statusKanbanOrderRepository;
    }

    @Transactional
    public StatusKanbanOrder createStatusKanbanOrder(StatusKanbanOrder statusKanbanOrder) {
        return statusKanbanOrderRepository.save(statusKanbanOrder);
    }

    @Transactional
    public StatusKanbanOrder updateStatusKanbanOrder(StatusKanbanOrder statusKanbanOrder) {
        return statusKanbanOrderRepository.save(statusKanbanOrder);
    }

    @Transactional(readOnly = true)
	public StatusKanbanOrder findStatusKanbanOrder(Integer statusKanbanOrderId) {
		return statusKanbanOrderRepository.findById(statusKanbanOrderId)
				.orElseThrow(() -> new ResourceNotFoundException("StatusKanbanOrder", "id", statusKanbanOrderId));
	}

    @Transactional(readOnly = true)
	public List<StatusKanbanOrder> findAllStatusKanbanOrder() {
		return statusKanbanOrderRepository.findAll();
	}

    @Transactional(readOnly = true)
	public List<StatusKanbanOrder> findAllStatusKanbanOrderByArtist(Integer artistId) {
		return statusKanbanOrderRepository.findByArtist(artistId);
	}

    @Transactional
    public void deleteStatusKanbanOrder(Integer id) {
        statusKanbanOrderRepository.deleteById(id);
    }

    // TODO: updateOrder
}
