package com.HolosINC.Holos.Kanban;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.HolosINC.Holos.Kanban.DTOs.StatusKanbanDTO;
import com.HolosINC.Holos.Kanban.DTOs.StatusKanbanUpdateDTO;
import com.HolosINC.Holos.Kanban.DTOs.StatusKanbanWithCommisionsDTO;
import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.artist.ArtistService;
import com.HolosINC.Holos.commision.Commision;
import com.HolosINC.Holos.commision.CommisionRepository;
import com.HolosINC.Holos.commision.CommisionService;
import com.HolosINC.Holos.commision.StatusCommision;
import com.HolosINC.Holos.exceptions.AccessDeniedException;
import com.HolosINC.Holos.exceptions.BadRequestException;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.exceptions.ResourceNotOwnedException;
import com.HolosINC.Holos.model.BaseUserService;

@Service
public class StatusKanbanOrderService {

    private final StatusKanbanOrderRepository statusKanbanOrderRepository;
    private final CommisionRepository commisionRepository;
    private final ArtistService artistService;
    private final BaseUserService userService;
    private final CommisionService commisionService;

    @Autowired
    public StatusKanbanOrderService(StatusKanbanOrderRepository statusKanbanOrderRepository, ArtistService artistService, BaseUserService userService, CommisionRepository commisionRepository, @Lazy CommisionService commisionService) {
        this.statusKanbanOrderRepository = statusKanbanOrderRepository;
        this.artistService = artistService;
        this.userService = userService;
        this.commisionRepository = commisionRepository;
        this.commisionService = commisionService;
    }

    @Transactional
    public StatusKanbanOrder createStatusKanbanOrder(StatusKanbanOrder statusKanbanOrder) {
        return statusKanbanOrderRepository.save(statusKanbanOrder);
    }

    @Transactional
    public StatusKanbanOrder addStatusToKanban(String color, String description, String nombre) {
        StatusKanbanOrder statusKanbanOrder = new StatusKanbanOrder();
        statusKanbanOrder.setColor(color);
        statusKanbanOrder.setDescription(description);
        statusKanbanOrder.setName(nombre);

        Long currentUserId = userService.findCurrentUser().getId();
        Artist artist = artistService.findArtistByUserId(currentUserId);

        List<StatusKanbanOrder> list = statusKanbanOrderRepository.findByArtistIdOrderByOrderAsc(artist.getId());
        int order = list.isEmpty() ? 1 : list.size() + 1;

        statusKanbanOrder.setOrder(order);
        statusKanbanOrder.setArtist(artist);

        try {
            return statusKanbanOrderRepository.save(statusKanbanOrder);
        } catch (DataIntegrityViolationException e) {
            throw new BadRequestException("Ya existe un estado con ese nombre u orden para este artista.");
        }
    }

    @Transactional
    public void updateStatusKanban(StatusKanbanUpdateDTO dto) {
        StatusKanbanOrder sk = statusKanbanOrderRepository.findById(dto.getId().intValue())
            .orElseThrow(() -> new ResourceNotFoundException("StatusKanbanOrder", "id", dto.getId()));
    
        if (commisionService.isStatusKanbanInUse(sk)) {
            throw new BadRequestException("No se puede modificar un estado que está asignado a una o más comisiones.");
        }
    
        sk.setName(dto.getNombre());
        sk.setColor(dto.getColor());
        sk.setDescription(dto.getDescription());
    
        try {
            statusKanbanOrderRepository.save(sk);
        } catch (DataIntegrityViolationException e) {
            throw new BadRequestException("Ya existe otro estado con ese nombre u orden para este artista.");
        }
    }

    @Transactional
    public StatusKanbanOrder updateKanban(int id, String color, String description, String nombre) {
        StatusKanbanOrder sk = statusKanbanOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("StatusKanbanOrder", "id", id));
        sk.setColor(color);
        sk.setDescription(description);
        sk.setName(nombre);
        return statusKanbanOrderRepository.save(sk);
    }

    @Transactional
    public StatusKanbanOrder updateOrder(Long id, Integer order) {
        StatusKanbanOrder statusKanban = statusKanbanOrderRepository.findById(id.intValue())
                .orElseThrow(() -> new ResourceNotFoundException("StatusKanbanOrder", "id", id));
        
        Artist artist = artistService.findArtist(userService.findCurrentUser().getId());
        List<StatusKanbanOrder> kanban = statusKanbanOrderRepository.findByArtistIdOrderByOrderAsc(artist.getId());

        if (order <= 0 || kanban.size() < order)
            throw new IllegalArgumentException("El orden proporcionado no es válido. Debe estar entre 1 y " + kanban.size());

        kanban.remove(statusKanban);
        kanban.add(order - 1, statusKanban);

        // Añadir un order negativo para evitar problemas de unicidad
        for(int i=1; i<=kanban.size(); i++) {
            kanban.get(i - 1).setOrder(-i);
        }
        statusKanbanOrderRepository.saveAll(kanban);
        statusKanbanOrderRepository.flush();

        // Establecer el orden bien
        for(int i=1; i<=kanban.size(); i++) {
            kanban.get(i - 1).setOrder(i);
        }
        statusKanbanOrderRepository.saveAll(kanban);

        return kanban.get(order-1);
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
    

    @Transactional
    public void deleteStatusKanbanOrder(Integer id) {
        StatusKanbanOrder statusToDelete = statusKanbanOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("StatusKanbanOrder", "id", id));

        Integer artistId = statusToDelete.getArtist().getId().intValue();
        Integer orderDeleted = statusToDelete.getOrder();

        statusKanbanOrderRepository.deleteById(id);

        List<StatusKanbanOrder> statusList = statusKanbanOrderRepository.findByArtist(artistId);

        for (StatusKanbanOrder status : statusList) {
            if (status.getOrder() > orderDeleted) {
                status.setOrder(status.getOrder() - 1);
                statusKanbanOrderRepository.save(status);
            }
        }
    }

    @Transactional
    public StatusKanbanOrder updateOrder(StatusKanbanOrder statusKanbanOrder) {
        return statusKanbanOrderRepository.save(statusKanbanOrder);
    }

    @Transactional
    public Pair<List<StatusKanbanDTO>, List<StatusKanbanWithCommisionsDTO>> getAllStatusFromArtist() {
        try {
            Long artistId = userService.findCurrentUser().getId();
            List<StatusKanbanDTO> statuses =  statusKanbanOrderRepository.getAllStatusOrdererOfArtist(artistId);
            List<StatusKanbanWithCommisionsDTO> commisions = statusKanbanOrderRepository.getAllCommisionsAcceptedOfArtist(artistId);
            return Pair.of(statuses, commisions);
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw e;
        }
    }

    @Transactional
    public Integer countByArtistUsername(String username) {
        try {
            return statusKanbanOrderRepository.countByArtistUsername(username);
        } catch (Exception e) {
            throw e;
        }
    }
    
    public List<StatusKanbanOrder> findAllStatusKanbanOrderByArtist(Long intValue) {
        return statusKanbanOrderRepository.findByArtistIdOrderByOrderAsc(intValue);
    }

    @Transactional
    public Commision nextStatusOfCommision(Long id) {
        try {
            Long artistId = userService.findCurrentUser().getId();
            Commision c = commisionRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Comisión no encontrada"));
            if (artistId.equals(c.getArtist().getId()))
                throw new AccessDeniedException("No tienes permisos para cambiar esta comisión");

            StatusKanbanOrder thisStatus = statusKanbanOrderRepository.actualStatusKanban(id);
            Optional<StatusKanbanOrder> nextStatus = statusKanbanOrderRepository.nextStatusKanban(thisStatus.getArtist().getId(),
                                                                                                     thisStatus.getOrder() + 1);
            if (nextStatus.isEmpty()) {
                c.setStatusKanbanOrder(null);
                c.setStatus(StatusCommision.ENDED);
            } else 
                c.setStatusKanbanOrder(nextStatus.get());

            commisionRepository.save(c);
            return c;
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw e;
        }
    }

    @Transactional
    public Commision previousStatusOfCommision(Long id) throws Exception {
        try {
            Long artistId = userService.findCurrentUser().getId();
            Commision c = commisionRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Comisión no encontrada"));
            if (artistId.equals(c.getArtist().getId()))
                throw new ResourceNotOwnedException("No tienes permisos para cambiar esta comisión");

            StatusKanbanOrder thisStatus = statusKanbanOrderRepository.actualStatusKanban(id);
            Optional<StatusKanbanOrder> previousStatus = statusKanbanOrderRepository.nextStatusKanban(thisStatus.getArtist().getId(),
                                                                                                     thisStatus.getOrder() - 1);
            if (previousStatus.isEmpty()) {
                throw new Exception("No tienes un estado anterior para esta comisión");
            } else 
                c.setStatusKanbanOrder(previousStatus.get());

            commisionRepository.save(c);
            return c;
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw e;
        }
    }
}
