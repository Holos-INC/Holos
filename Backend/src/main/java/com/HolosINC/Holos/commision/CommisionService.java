package com.HolosINC.Holos.commision;

import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.HolosINC.Holos.Kanban.StatusKanbanOrder;
import com.HolosINC.Holos.Kanban.StatusKanbanOrderService;
import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.artist.ArtistService;
import com.HolosINC.Holos.client.Client;
import com.HolosINC.Holos.client.ClientService;
import com.HolosINC.Holos.commision.DTOs.CommisionDTO;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserService;

@Service
public class CommisionService {
    
    private final CommisionRepository commisionRepository;
    private final ArtistService artistService;
    private final BaseUserService userService;
    private final StatusKanbanOrderService statusKanbanOrderService;

    @Autowired
    public CommisionService(CommisionRepository commisionRepository, ArtistService artistService, BaseUserService userService, StatusKanbanOrderService statusKanbanOrderService){
        this.commisionRepository = commisionRepository;
        this.artistService = artistService;
        this.userService = userService;
        this.statusKanbanOrderService = statusKanbanOrderService;
    }

    public Commision createCommision(CommisionDTO commisionDTO, Long artistId) {
        Commision commision = commisionDTO.createCommision();
        Artist artist = artistService.findArtist(artistId);
        BaseUser client = userService.findCurrentUser();

        if (artist == null || !artist.hasAnyAuthority("ARTIST"))
            throw new IllegalArgumentException("Envíe la solicitud de comisión a un artista válido");

        commision.setArtist(artist);
        commision.setClient((Client) client);
        commision.setStatus(StatusCommision.REQUESTED);

        return commisionRepository.save(commision);
    }

    public List<Commision> getAllCommisions() {
        return commisionRepository.findAll();
    }

    public Commision getCommisionById(Long id) {
        return commisionRepository.findById(id).orElse(null);
    }

    @Transactional
    public Commision updateCommisionStatus(Long commisionId, Long artistId, boolean accept) {
        Commision commision = commisionRepository.findById(commisionId)
                .orElseThrow(() -> new ResourceNotFoundException("Commision", "id", commisionId));

        Artist artist = artistService.findArtist(artistId);

        if (!commision.getArtist().getId().equals(artist.getId())) {
            throw new IllegalArgumentException("El artista no tiene permisos para modificar esta comisión.");
        }

        if (accept) { 
            commision.setAcceptedDateByArtist(new Date());
            if (artist.getNumSlotsOfWork() - commisionRepository.numSlotsCovered(artistId) > 0) {
                commision.setStatus(StatusCommision.ACCEPTED);
            } else {
                commision.setStatus(StatusCommision.IN_WAIT_LIST);
            }
        } else { 
            if (!commision.getStatus().equals(StatusCommision.REQUESTED)) {
                throw new IllegalStateException("Solo se pueden rechazar comisiones en estado 'REQUESTED'.");
            }
            commision.setStatus(StatusCommision.REJECTED);
        }

        return commisionRepository.save(commision);
    }

    @Transactional
    public void cancelCommision(Long commisionId, Long clientId) {
        Commision commision = commisionRepository.findById(commisionId)
                .orElseThrow(() -> new ResourceNotFoundException("Commision", "id", commisionId));

        if (!commision.getClient().getId().equals(clientId)) {
            throw new IllegalArgumentException("El cliente no tiene permisos para cancelar esta comisión.");
        }

        if (!(commision.getStatus() == StatusCommision.REQUESTED ||
            commision.getStatus() == StatusCommision.IN_WAIT_LIST ||
            commision.getStatus() == StatusCommision.ACCEPTED)) {
            throw new IllegalStateException("La comisión no puede ser cancelada en su estado actual.");
        }

        commision.setStatus(StatusCommision.CANCELED);
        commisionRepository.save(commision);
    }

    @Transactional
    public Collection<Commision> getCommissionsByKanbanOrderId(Long kanbanOrderId) {
        // Verifica si el kanbanOrderId es nulo para evitar errores en la consulta.
        if (kanbanOrderId == null) {
            throw new IllegalArgumentException("Kanban Order ID cannot be null");
        }
        // Usar el nombre correcto para el método de repositorio y los parámetros.
        Collection<Commision> commissions = commisionRepository.findAllCommissionsByStatusKanbanOrder(kanbanOrderId);
        return commissions != null ? commissions : Collections.emptyList();
    }


}
