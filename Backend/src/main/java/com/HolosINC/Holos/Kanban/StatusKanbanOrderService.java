package com.HolosINC.Holos.Kanban;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

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
import com.HolosINC.Holos.model.BaseUser;
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
    public StatusKanbanOrder addStatusToKanban(String color, String description, String nombre) throws Exception {
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
    
        sk.setName(dto.getName());
        sk.setColor(dto.getColor());
        sk.setDescription(dto.getDescription());
    
        try {
            statusKanbanOrderRepository.save(sk);
        } catch (DataIntegrityViolationException e) {
            throw new BadRequestException("Ya existe otro estado con ese nombre u orden para este artista.");
        }
    }

    @Transactional(readOnly = true)
    public StatusKanbanDTO getStatusKanbanById(Integer id) {
        StatusKanbanOrder status = statusKanbanOrderRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("StatusKanbanOrder", "id", id));
    
        return new StatusKanbanDTO(
            status.getId(),
            status.getName(),
            status.getOrder(),
            status.getDescription(),
            status.getColor()
        );
    }    

    @Transactional
    public void deleteStatusKanbanOrder(Integer id) {
        StatusKanbanOrder statusToDelete = statusKanbanOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("StatusKanbanOrder", "id", id));
    
        if (commisionService.isStatusKanbanInUse(statusToDelete)) {
            throw new BadRequestException("No se puede eliminar un estado que está asignado a una o más comisiones.");
        }
    
        Integer artistId = statusToDelete.getArtist().getId().intValue();
        Integer orderDeleted = statusToDelete.getOrder();
    
        statusKanbanOrderRepository.deleteById(id);
        statusKanbanOrderRepository.flush();
    
        List<StatusKanbanOrder> statusList = statusKanbanOrderRepository.findByArtist(artistId)
            .stream()
            .filter(s -> s.getOrder() > orderDeleted)
            .sorted((a, b) -> Integer.compare(a.getOrder(), b.getOrder()))
            .toList();
    
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
    public void nextStatusOfCommision(Long id) throws Exception {
        try {
            BaseUser currentUser = userService.findCurrentUser();
            Artist currentArtist = artistService.findArtistByUserId(currentUser.getId());
            if (currentArtist == null) {
                throw new AccessDeniedException("Tu usuario no está vinculado a ningún artista.");
            }

            Commision c = commisionRepository.findById(id)
                
                    .orElseThrow(() -> new ResourceNotFoundException("Comisión no encontrada"));


            if (!currentArtist.getId().equals(c.getArtist().getId())) {
                throw new ResourceNotOwnedException("No tienes permisos para modificar una comisión que no te pertenece.");
            }  
            

            StatusKanbanOrder thisStatus = statusKanbanOrderRepository.actualStatusKanban(id);
            if (thisStatus == null) {
                throw new ResourceNotFoundException("La comisión con ID " + id + " no tiene un estado asignado.");
            }
            Optional<StatusKanbanOrder> nextStatus = statusKanbanOrderRepository.nextStatusKanban(
                    thisStatus.getArtist().getId(),
                    thisStatus.getOrder() + 1
            );

            if (nextStatus.isEmpty()) {
                // Si no hay un siguiente estado, establecer el estado en null y finalizar la comisión
                c.setStatusKanbanOrder(null);
                c.setStatus(StatusCommision.ENDED);

                // Buscar la comisión más antigua en IN_WAIT_LIST
                Optional<Commision> oldestInWaitList = commisionRepository
                        .findFirstByStatusOrderByCreatedDateAsc(StatusCommision.IN_WAIT_LIST);

                // Si existe una comisión en IN_WAIT_LIST, cambiar su estado a ACCEPTED
                if (oldestInWaitList.isPresent()) {
                    Commision oldestCommision = oldestInWaitList.get();
                    oldestCommision.setStatus(StatusCommision.ACCEPTED);
                    commisionRepository.save(oldestCommision);
                }
            } else {
                // Avanzar al siguiente estado
                c.setStatusKanbanOrder(nextStatus.get());

            System.out.println("ID del usuario actual: " + currentUser.getId());
            System.out.println("Artista asociado al usuario: " + currentArtist.getId());
            System.out.println("Artista de la comisión: " + c.getArtist().getId());
                
            commisionRepository.save(c);
        }} catch (Exception e) {
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
    
        StatusKanbanOrder thisStatus = c.getStatusKanbanOrder();
        if (thisStatus == null) {
            throw new ResourceNotFoundException("La comisión con ID " + id + " no tiene un estado asignado.");
        }
    
        Optional<StatusKanbanOrder> previousStatus = statusKanbanOrderRepository
            .nextStatusKanban(currentArtist.getId(), thisStatus.getOrder() - 1);
    
        if (previousStatus.isEmpty()) {
            throw new BadRequestException("No existe un estado anterior a este.");
        } else {
            c.setStatusKanbanOrder(previousStatus.get());
            commisionRepository.save(c);
        }
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
