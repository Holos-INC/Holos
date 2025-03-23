package com.HolosINC.Holos.commision;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.HolosINC.Holos.Kanban.StatusKanbanOrder;
import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.artist.ArtistService;
import com.HolosINC.Holos.client.Client;
import com.HolosINC.Holos.client.ClientRepository;
import com.HolosINC.Holos.commision.DTOs.CommisionDTO;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.model.BaseUserService;

@Service
public class CommisionService {
    
    private final CommisionRepository commisionRepository;
    private final ClientRepository clientRepository;
    private final ArtistService artistService;
    private final BaseUserService userService;

    @Autowired
    public CommisionService(CommisionRepository commisionRepository, ArtistService artistService, BaseUserService userService, ClientRepository clientRepository) {
        this.commisionRepository = commisionRepository;
        this.artistService = artistService;
        this.userService = userService;
        this.clientRepository = clientRepository;
    }

    public Commision createCommision(CommisionDTO commisionDTO, Long artistId) {
        Commision commision = commisionDTO.createCommision();
        Artist artist = artistService.findArtist(artistId);
        Optional<Client> client = clientRepository.getClientByUser(userService.findCurrentUser().getId());
        if (client.isEmpty()) {
            throw new ResourceNotFoundException("Client", "id", userService.findCurrentUser().getId());
        }

        if (artist == null || !artist.getBaseUser().hasAnyAuthority("ARTIST"))
            throw new IllegalArgumentException("Envíe la solicitud de comisión a un artista válido");

        commision.setArtist(artist);
        commision.setClient(client.get());
        commision.setStatus(StatusCommision.REQUESTED);

        return commisionRepository.save(commision);
    }

    public List<Commision> getAllCommisions() {
        return commisionRepository.findAll();
    }

    public Commision getCommisionById(Long id) {
        return commisionRepository.findById(id).orElse(null);
    }

    // TODO - Permitir que el artista pueda cancelar el pedido en el futuro
    @Transactional
    public Commision updateCommisionStatus(Long commisionId, boolean accept) {
        Commision commision = commisionRepository.findById(commisionId)
                .orElseThrow(() -> new ResourceNotFoundException("Commision", "id", commisionId));

        Artist artist = artistService.findArtist(userService.findCurrentUser().getId());

        if (!commision.getArtist().getId().equals(artist.getId())) {
            throw new IllegalArgumentException("El artista no tiene permisos para modificar esta comisión.");
        }

        if (!commision.getStatus().equals(StatusCommision.REQUESTED))
            throw new IllegalArgumentException("El estado de la comisión ya no es editable");

        if (accept) { 
            commision.setAcceptedDateByArtist(new Date());
            if (artist.getNumSlotsOfWork() - commisionRepository.numSlotsCovered(artist.getId()) > 0) {
                commision.setStatus(StatusCommision.ACCEPTED);

                Optional<StatusKanbanOrder> statusKanban = commisionRepository.getFirstStatusKanbanOfArtist(artist.getId());
                if (statusKanban.isEmpty())
                    throw new ResourceNotFoundException("Antes de aceptar una comisión, créate un estado en el Kanban");
                commision.setStatusKanbanOrder(statusKanban.get());
            } else {
                commision.setStatus(StatusCommision.IN_WAIT_LIST);
            }
        } else {
            commision.setStatus(StatusCommision.REJECTED);
        }

        return commisionRepository.save(commision);
    }

    // TODO - Revisar lógica de negocio para ver la posibilidad de que el artista o cliente cancele a mitad de pedido
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

}
