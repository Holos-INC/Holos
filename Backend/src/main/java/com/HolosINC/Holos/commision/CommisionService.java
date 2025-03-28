package com.HolosINC.Holos.commision;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.HolosINC.Holos.Kanban.StatusKanbanOrder;
import com.HolosINC.Holos.Kanban.StatusKanbanOrderService;
import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.artist.ArtistService;
import com.HolosINC.Holos.client.Client;
import com.HolosINC.Holos.client.ClientRepository;
import com.HolosINC.Holos.client.ClientService;
import com.HolosINC.Holos.commision.DTOs.ClientCommissionDTO;
import com.HolosINC.Holos.commision.DTOs.CommisionDTO;
import com.HolosINC.Holos.commision.DTOs.CommisionRequestDTO;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserService;

@Service
public class CommisionService {
    
    private final CommisionRepository commisionRepository;
    private final ClientRepository clientRepository;
    private final ArtistService artistService;
    private final BaseUserService userService;
    private final ClientService clientService;
    private final StatusKanbanOrderService statusKanbanOrderService;

    @Autowired
    public CommisionService(CommisionRepository commisionRepository, ArtistService artistService, BaseUserService userService, ClientRepository clientRepository, ClientService clientService, StatusKanbanOrderService statusKanbanOrderService) {
        this.commisionRepository = commisionRepository;
        this.artistService = artistService;
        this.userService = userService;
        this.clientRepository = clientRepository;
        this.clientService = clientService;
        this.statusKanbanOrderService = statusKanbanOrderService;
    }

    public Commision createCommision(CommisionRequestDTO commisionDTO, Long artistId) throws Exception {
        try {
            Commision commision = commisionDTO.createCommision();
            Artist artist = artistService.findArtist(artistId);
            Optional<Client> client = clientRepository.findById(userService.findCurrentUser().getId());
            if (client.isEmpty()) {
                throw new ResourceNotFoundException("Client", "id", userService.findCurrentUser().getId());
            }
    
            if (artist == null || !artist.getBaseUser().hasAnyAuthority("ARTIST"))
                throw new IllegalArgumentException("Envíe la solicitud de comisión a un artista válido");
    
            commision.setArtist(artist);
            commision.setClient(client.get());
            commision.setStatus(StatusCommision.REQUESTED);
    
            return commisionRepository.save(commision);
        } catch (Exception e) {
            throw e;
        }
    }

    @Transactional
    public Commision requestChangesCommision(CommisionDTO commisionDTO, Long commisionId) throws Exception {
        try {
            BaseUser user = userService.findCurrentUser();
            Commision commisionUpdated = commisionDTO.createCommision();
            Commision commisionInBDD = commisionRepository.findById(commisionId)
                .orElseThrow(() -> new ResourceNotFoundException("No existe la comisión que se quiere cambiar"));
            
            if (!(user.getId().equals(commisionInBDD.getClient().getBaseUser().getId()) || 
                  user.getId().equals(commisionInBDD.getArtist().getBaseUser().getId())))
                  throw new IllegalArgumentException("No puedes editar una comisión que no te pertenece");

            if (user.hasAuthority("ARTIST"))
                commisionUpdated.setStatus(StatusCommision.WAITING_CLIENT);
            if (user.hasAuthority("CLIENT"))
                commisionUpdated.setStatus(StatusCommision.WAITING_ARTIST);

            BeanUtils.copyProperties(commisionUpdated, commisionInBDD);

            return commisionRepository.save(commisionInBDD);
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw e;
        }
    }

    public List<Commision> getAllCommisions() {
        return commisionRepository.findAll();
    }

    @Transactional(readOnly=true)
    public List<Commision> getAllRequestedCommisions() {
        try {
            BaseUser user = userService.findCurrentUser();
            List<Commision> commisions = null;

            if (user.hasAuthority("ARTIST"))
                commisions = commisionRepository.findAllPendingCommisionsByArtistId(user.getId());
            if (user.hasAuthority("CLIENT"))
                commisions = commisionRepository.findAllPendingCommisionsByClientId(user.getId());
            
            return commisions;
        } catch (Exception e) {
            throw e;
        }
    }

    public Commision getCommisionById(Long id) {
        return commisionRepository.findById(id).orElse(null);
    }

    @Transactional
    public Commision updateCommisionStatus(Long commisionId, boolean accept) {
        Commision commision = commisionRepository.findById(commisionId)
                .orElseThrow(() -> new ResourceNotFoundException("Commision", "id", commisionId));

        Artist artist = artistService.findArtistByUserId(userService.findCurrentUser().getId());

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
    public List<ClientCommissionDTO> getClientCommissions() {
        Long userId = userService.findCurrentUser().getId();

        Client currentClient = clientService.findClientByUserId(userId);
        if (currentClient == null) {
            throw new ResourceNotFoundException("Client not found for user ID: " + userId);
        }

        List<ClientCommissionDTO> commissions = commisionRepository.findAllForClient(currentClient);

        if (commissions == null || commissions.isEmpty()) {
            throw new IllegalStateException("No commissions found for this client!");
        }

        for (ClientCommissionDTO commission : commissions) {
            Integer totalSteps = statusKanbanOrderService.countByArtistUsername(commission.getArtistUsername());
            commission.setTotalSteps(totalSteps);
        }

        return commissions;
    }
}
