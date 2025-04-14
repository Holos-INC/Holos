package com.HolosINC.Holos.Kanban;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.context.annotation.Lazy;
import org.springframework.dao.DataIntegrityViolationException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.HolosINC.Holos.Kanban.DTOs.StatusKanbanCreateDTO;
import com.HolosINC.Holos.Kanban.DTOs.StatusKanbanDTO;
import com.HolosINC.Holos.Kanban.DTOs.StatusKanbanFullResponseDTO;
import com.HolosINC.Holos.Kanban.DTOs.StatusKanbanUpdateDTO;
import com.HolosINC.Holos.Kanban.DTOs.StatusKanbanWithCommisionsDTO;
import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.artist.ArtistService;
import com.HolosINC.Holos.commision.Commision;
import com.HolosINC.Holos.commision.CommisionRepository;
import com.HolosINC.Holos.commision.CommisionService;
import com.HolosINC.Holos.commision.StatusCommision;
import com.HolosINC.Holos.exceptions.BadRequestException;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.exceptions.ResourceNotOwnedException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserService;

@Service
public class StatusKanbanOrderService {

    private final StatusKanbanOrderRepository statusKanbanOrderRepository;
    private final CommisionRepository commisionRepository;
    private final ArtistService artistService;
    private final BaseUserService userService;
    private final CommisionService commisionService;

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

    public StatusKanbanOrder addStatusToKanban(StatusKanbanCreateDTO dto) throws Exception {
        StatusKanbanOrder statusKanbanOrder = new StatusKanbanOrder();
        BeanUtils.copyProperties(dto, statusKanbanOrder);

        Long currentUserId = userService.findCurrentUser().getId();
        Artist artist = artistService.findArtistByUserId(currentUserId);
        int order = statusKanbanOrderRepository.countByArtistUsername(artist.getBaseUser().getUsername()) + 1;

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
        StatusKanbanOrder sk = statusKanbanOrderRepository.findById(dto.getId())
            .orElseThrow(() -> new ResourceNotFoundException("StatusKanbanOrder", "id", dto.getId()));
        if (commisionService.isStatusKanbanInUse(sk)) {
            throw new BadRequestException("No se puede modificar un estado que está asignado a una o más comisiones.");
        }

    
        BeanUtils.copyProperties(dto, sk, "id");
    
        try {
            statusKanbanOrderRepository.save(sk);
        } catch (DataIntegrityViolationException e) {
            throw new BadRequestException("Ya existe otro estado con ese nombre u orden para este artista.");
        }
    }
    
    @Transactional
    public StatusKanbanOrder updateStatusKanbanOrder(StatusKanbanOrder statusKanbanOrder) {
        return statusKanbanOrderRepository.save(statusKanbanOrder);
    }

    @Transactional
    public StatusKanbanOrder updateKanban(Long id, String color, String description, String nombre) throws Exception {
        StatusKanbanOrder sk = statusKanbanOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("StatusKanbanOrder", "id", id));
        sk.setColor(color);
        sk.setDescription(description);
        sk.setName(nombre);
        return statusKanbanOrderRepository.save(sk);
    }

    @Transactional
    public StatusKanbanOrder updateOrder(Long id, Integer order) throws Exception{
        StatusKanbanOrder statusKanban = statusKanbanOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("StatusKanbanOrder", "id", id));
        
        Artist artist = artistService.findArtist(userService.findCurrentUser().getId());
        List<StatusKanbanOrder> kanban = statusKanbanOrderRepository.findByArtistIdOrderByOrderAsc(artist.getId());

        if (order <= 0 || kanban.size() < order)
            throw new IllegalArgumentException("El orden proporcionado no es válido. Debe estar entre 1 y " + kanban.size());

        kanban.remove(statusKanban);
        kanban.add(order - 1, statusKanban);

        for(int i=1; i<=kanban.size(); i++) {
            kanban.get(i - 1).setOrder(-i);
        }
    
        try {
            statusKanbanOrderRepository.save(statusKanban);
            return statusKanban;
        } catch (DataIntegrityViolationException e) {
            throw new BadRequestException("Ya existe otro estado con ese nombre u orden para este artista.");
        }
    }

    @Transactional(readOnly = true)
    public StatusKanbanDTO getStatusKanbanById(Long id) {
        StatusKanbanOrder status = statusKanbanOrderRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("StatusKanbanOrder", "id", id));
    
        return new StatusKanbanDTO(status);
    }    

    @Transactional
    public void deleteStatusKanbanOrder(Long id) {
        StatusKanbanOrder statusToDelete = statusKanbanOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("StatusKanbanOrder", "id", id));
    
        if (commisionService.isStatusKanbanInUse(statusToDelete)) {
            throw new BadRequestException("No se puede eliminar un estado que está asignado a una o más comisiones.");
        }
    
        Long artistId = statusToDelete.getArtist().getId();
        Integer orderDeleted = statusToDelete.getOrder();
    
        statusKanbanOrderRepository.deleteById(id);
        statusKanbanOrderRepository.flush();
    
        List<StatusKanbanOrder> statusList = statusKanbanOrderRepository.findByArtistIdOrderByOrderAscFiltered(artistId, orderDeleted);
    
        for (StatusKanbanOrder status : statusList) {
            status.setOrder(-status.getOrder());
        }
        statusKanbanOrderRepository.saveAll(statusList);
        statusKanbanOrderRepository.flush();
    
        for (StatusKanbanOrder status : statusList) {
            status.setOrder(-status.getOrder() - 1);
        }
        statusKanbanOrderRepository.saveAll(statusList);
    }

    @Transactional
    public StatusKanbanFullResponseDTO getAllStatusFromArtist() {
        try {
            Long artistId = userService.findCurrentUser().getId();
            List<StatusKanbanDTO> statuses =  statusKanbanOrderRepository.getAllStatusOrdererOfArtist(artistId);
            List<StatusKanbanWithCommisionsDTO> commisions = statusKanbanOrderRepository.getAllCommisionsAcceptedOfArtist(artistId);
            return new StatusKanbanFullResponseDTO(statuses, commisions);
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
    public void nextStatusOfCommision(Long id) throws Exception {
        try {
            BaseUser currentUser = userService.findCurrentUser();
            Artist currentArtist = artistService.findArtistByUserId(currentUser.getId());

            Commision c = commisionRepository.findById(id)
                
                    .orElseThrow(() -> new ResourceNotFoundException("Comisión no encontrada"));


            if (!currentArtist.getId().equals(c.getArtist().getId())) {
                throw new ResourceNotOwnedException("No tienes permisos para modificar una comisión que no te pertenece.");
            }  
            

            StatusKanbanOrder thisStatus = statusKanbanOrderRepository.actualStatusKanban(id);
            if (thisStatus == null) {
                throw new ResourceNotFoundException("La comisión con ID " + id + " no tiene un estado asignado.");
            }
            Optional<StatusKanbanOrder> nextStatus = statusKanbanOrderRepository.statusKanbanOfOrder(thisStatus.getArtist().getId(),
                                                                                                     thisStatus.getOrder() + 1);
            if (nextStatus.isEmpty()) {
                // Si no hay un siguiente estado, establecer el estado en null y finalizar la comisión
                c.setStatusKanbanOrder(null);
                c.setStatus(StatusCommision.ENDED);

                // Buscar la comisión más antigua en IN_WAIT_LIST
                Optional<Commision> oldestInWaitList = commisionRepository
                        .findFirstByStatusOrderByAcceptedDateByArtistAsc(StatusCommision.IN_WAIT_LIST);

                // Si existe una comisión en IN_WAIT_LIST, cambiar su estado a ACCEPTED
                if (oldestInWaitList.isPresent()) {
                    Commision oldestCommision = oldestInWaitList.get();
                    // No hace falta excepciones porque en otras validaciones ya se obliga a que este artista tenga al menos un statusKanban, al tener comisiones aceptadas
                    StatusKanbanOrder firstStatusKanbanOrder = commisionRepository
                        .getFirstStatusKanbanOfArtist(currentArtist.getId()).get();
                    oldestCommision.setStatus(StatusCommision.ACCEPTED);
                    oldestCommision.setStatusKanbanOrder(firstStatusKanbanOrder);
                    commisionRepository.save(oldestCommision);
                }
            } else
                // Avanzar al siguiente estado
                c.setStatusKanbanOrder(nextStatus.get());
                
            commisionRepository.save(c);
        } catch (Exception e) {
            throw e;
        }
    }

    @Transactional
    public void previousStatusOfCommision(Long id) throws Exception {
        BaseUser currentUser = userService.findCurrentUser();
        Artist currentArtist = artistService.findArtistByUserId(currentUser.getId());
    
        Commision c = commisionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Comisión no encontrada"));
    
        if (!currentArtist.getId().equals(c.getArtist().getId())) {
            throw new ResourceNotOwnedException("No tienes permisos para modificar una comisión que no te pertenece.");
        }

        Optional<StatusKanbanOrder> previousStatus = statusKanbanOrderRepository
            .statusKanbanOfOrder(currentArtist.getId(), c.getStatusKanbanOrder().getOrder() - 1);
    
        if (previousStatus.isEmpty()) {
            throw new BadRequestException("No existe un estado anterior a este.");
        }
        c.setStatusKanbanOrder(previousStatus.get());
        commisionRepository.save(c);    
    }

    @Transactional
    public void reorderStatuses(List<Long> orderedIds) throws Exception {
        if (orderedIds == null || orderedIds.isEmpty())
            throw new BadRequestException("La lista de IDs no puede estar vacía.");

        Set<Long> uniqueIds = new HashSet<>(orderedIds);
        if (uniqueIds.size() != orderedIds.size()) {
            throw new BadRequestException("La lista contiene IDs duplicados.");
        }

        Long userId = userService.findCurrentUser().getId();
        Artist artist = artistService.findArtistByUserId(userId);
        List<StatusKanbanOrder> allStatuses = statusKanbanOrderRepository.findByArtistIdOrderByOrderAsc(artist.getId());

        Map<Long, StatusKanbanOrder> map = allStatuses.stream()
                .collect(Collectors.toMap(StatusKanbanOrder::getId, s -> s));

        for (Long id : orderedIds) {
            if (!map.containsKey(id)) {
                throw new BadRequestException("El estado con ID " + id + " no pertenece al artista.");
            }
        }

        for (StatusKanbanOrder status : allStatuses) {
            status.setOrder(-status.getOrder());
        }

        statusKanbanOrderRepository.saveAll(allStatuses);
        statusKanbanOrderRepository.flush();

        int order = 1;
        for (Long id : orderedIds) {
            map.get(id).setOrder(order++);
        }

        statusKanbanOrderRepository.saveAll(allStatuses);
    }
    
}
