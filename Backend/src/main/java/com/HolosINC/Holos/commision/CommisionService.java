package com.HolosINC.Holos.commision;

import java.util.List;

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
import com.HolosINC.Holos.commision.DTOs.CommisionRequestDTO;
import com.HolosINC.Holos.commision.DTOs.CommissionDTO;
import com.HolosINC.Holos.commision.DTOs.HistoryCommisionsDTO;
import com.HolosINC.Holos.exceptions.BadRequestException;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.exceptions.ResourceNotOwnedException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserService;

@Service
public class CommisionService {

    private final CommisionRepository commisionRepository;
    private final ClientRepository clientRepository;
    private final ArtistService artistService;
    private final BaseUserService userService;
    private final StatusKanbanOrderService statusKanbanOrderService;
    private final ClientService clientService;

    @Autowired
    public CommisionService(CommisionRepository commisionRepository, ArtistService artistService,
            BaseUserService userService, ClientRepository clientRepository, ClientService clientService,
            StatusKanbanOrderService statusKanbanOrderService) {
        this.commisionRepository = commisionRepository;
        this.artistService = artistService;
        this.userService = userService;
        this.clientRepository = clientRepository;
        this.clientService = clientService;
        this.statusKanbanOrderService = statusKanbanOrderService;
    }

    public List<Commision> getAllCommisions() {
        return commisionRepository.findAll();
    }

    @Transactional
    public CommissionDTO createCommision(CommisionRequestDTO commisionDTO, Long artistId) throws Exception {
        try {
            Commision commision = commisionDTO.createCommision();
            Artist artist = artistService.findArtist(artistId);
            Client client = clientRepository.findClientByUserId(userService.findCurrentUser().getId())
                    .orElseThrow(
                            () -> new ResourceNotFoundException("Client", "id", userService.findCurrentUser().getId()));
            if (artist == null || !artist.getBaseUser().hasAnyAuthority("ARTIST"))
                throw new IllegalArgumentException("Envíe la solicitud de comisión a un artista válido");
            commision.setArtist(artist);
            commision.setClient(client);
            commision.setStatus(StatusCommision.REQUESTED);
            commision.setPaymentArrangement(commisionDTO.getPaymentArrangement()); 
            Integer kanbanColumnsNumber = statusKanbanOrderService.countByArtistUsername(artist.getBaseUser().getUsername());
            commision.configurePaymentArrangementValues(kanbanColumnsNumber);
            commisionRepository.save(commision);
            return new CommissionDTO(commision);
        } catch (Exception e) {
            throw e;
        }
    }

    @Transactional
    public Commision requestChangesCommision(CommissionDTO commisionDTO, Long commisionId) throws Exception {
        try {
            BaseUser user = userService.findCurrentUser();
            Commision commisionInBDD = commisionRepository.findById(commisionId)
                    .orElseThrow(() -> new ResourceNotFoundException("No existe la comisión que se quiere cambiar"));

            if (!(user.getId().equals(commisionInBDD.getClient().getBaseUser().getId()) ||
                    user.getId().equals(commisionInBDD.getArtist().getBaseUser().getId())))
                throw new IllegalArgumentException("No puedes editar una comisión que no te pertenece");

            commisionInBDD.setPrice(commisionDTO.getPrice());
            commisionInBDD.setPaymentArrangement(commisionDTO.getPaymentArrangement());
            Integer kanbanColumnsNumber = statusKanbanOrderService.countByArtistUsername(commisionDTO.getArtistUsername());
            commisionInBDD.configurePaymentArrangementValues(kanbanColumnsNumber);
            return commisionRepository.save(commisionInBDD);
        } catch (Exception e) {
            throw new Exception(e);
        }
    }

    @Transactional
    public CommissionDTO getCommisionById(Long commisionId) throws Exception {
        try {
            BaseUser user = userService.findCurrentUser();

            Commision commisionInBDD = commisionRepository.findById(commisionId)
                    .orElseThrow(() -> new ResourceNotFoundException("No existe la comisión con el ID proporcionado"));

            if (!(user.getId().equals(commisionInBDD.getClient().getBaseUser().getId()) ||
                    user.getId().equals(commisionInBDD.getArtist().getBaseUser().getId())))
                throw new IllegalArgumentException("No tienes permiso para acceder a esta comisión");

            return new CommissionDTO(commisionInBDD); 
        } catch (Exception e) {
            throw new Exception("Error al obtener la comisión: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void waitingCommission(CommissionDTO updatedCommissionDTO, Long commisionId) throws Exception {
        try{
            Commision commision = commisionRepository.findById(commisionId)
                .orElseThrow(() -> new ResourceNotFoundException("Commision", "id", commisionId));
            Long id = userService.findCurrentUser().getId();
            if (clientService.isClient(id)) {
                if (!commision.getClient().getBaseUser().getId().equals(id)) {
                    throw new IllegalArgumentException("El cliente no tiene permisos para poner en espera esta comisión.");
                }
                if (commision.getStatus() == StatusCommision.WAITING_CLIENT) {
                    commision.setStatus(StatusCommision.WAITING_ARTIST);
                    commision.setPrice(updatedCommissionDTO.getPrice());
                    commision.setPaymentArrangement(updatedCommissionDTO.getPaymentArrangement());
                    Integer kanbanColumnsNumber = statusKanbanOrderService.countByArtistUsername(updatedCommissionDTO.getArtistUsername());
                    commision.configurePaymentArrangementValues(kanbanColumnsNumber);
                } else {
                    throw new IllegalStateException("La comisión no puede ser puesta en espera en su estado actual.");
                }
            }
            if (artistService.isArtist(id)) {
                if (!commision.getArtist().getBaseUser().getId().equals(id)) {
                    throw new IllegalArgumentException("El artista no tiene permisos para poner en espera esta comisión.");
                }
                if (commision.getStatus() == StatusCommision.REQUESTED ||
                        commision.getStatus() == StatusCommision.WAITING_ARTIST) {
                    commision.setStatus(StatusCommision.WAITING_CLIENT);
                    commision.setPrice(updatedCommissionDTO.getPrice());
                    commision.setPaymentArrangement(updatedCommissionDTO.getPaymentArrangement());
                    Integer kanbanColumnsNumber = statusKanbanOrderService.countByArtistUsername(updatedCommissionDTO.getArtistUsername());
                    commision.configurePaymentArrangementValues(kanbanColumnsNumber);
                } else {
                    throw new IllegalStateException("La comisión no puede ser puesta en espera en su estado actual.");
                }
            }
            commisionRepository.save(commision);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Transactional
    public void requestPayment(Long commisionId) throws Exception {
        try{
            Commision commision = commisionRepository.findById(commisionId)
                .orElseThrow(() -> new ResourceNotFoundException("Commision", "id", commisionId));
            Long id = userService.findCurrentUser().getId();
            if (artistService.isArtist(id)) {
                if (!commision.getArtist().getBaseUser().getId().equals(id)) {
                    throw new ResourceNotOwnedException("El artista no tiene permisos para poner en espera esta comisión.");
                }
                if (commision.getStatus()!=StatusCommision.ACCEPTED){
                    throw new BadRequestException("No puedes solicitar el pago de una comisión que no está aceptada");
                }
                if (commision.isWaitingPayment()){
                    throw new BadRequestException("Esta comisión ya está esperando un pago");
                }
                if (commision.getPaymentArrangement()!=EnumPaymentArrangement.MODERATOR){
                    throw new BadRequestException("No puedes solicitar un pago de una comisión cuyo tipo de pago no es moderador");
                }
                if (commision.getTotalPayments()<=commision.getCurrentPayments()){
                    throw new BadRequestException("Esta comisión ya está completamente pagada");
                }
                commision.setWaitingPayment(true);
                commisionRepository.save(commision);
            }
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Transactional
    public void toPayCommission(Long commisionId) throws Exception {
        try{
            Commision commision = commisionRepository.findById(commisionId)
                .orElseThrow(() -> new ResourceNotFoundException("Commision", "id", commisionId));
            Long id = userService.findCurrentUser().getId();
            if (clientService.isClient(id)) {
                if (!commision.getClient().getBaseUser().getId().equals(id)) {
                    throw new IllegalArgumentException(
                            "El cliente no tiene permisos para aceptar el precio de esta comisión.");
                }
                if (commision.getStatus() == StatusCommision.WAITING_CLIENT) {
                    commision.setStatus(StatusCommision.NOT_PAID_YET);
                } else {
                    throw new IllegalStateException("No puedes aceptar el precio de esta comisión en su estado actual.");
                }
            }
            if (artistService.isArtist(id)) {
                if (!commision.getArtist().getBaseUser().getId().equals(id)) {
                    throw new IllegalArgumentException(
                            "El artista no tiene permisos para aceptar el precio de esta comisión.");
                }
                if (commision.getStatus() == StatusCommision.REQUESTED ||
                        commision.getStatus() == StatusCommision.WAITING_ARTIST) {
                    commision.setStatus(StatusCommision.NOT_PAID_YET);
                } else {
                    throw new IllegalStateException("No puedes aceptar el precio de esta comisión en su estado actual.");
                }
            }
            commisionRepository.save(commision);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Transactional
    public void rejectCommission(Long commisionId) throws Exception {
        try{
            Commision commision = commisionRepository.findById(commisionId)
                .orElseThrow(() -> new ResourceNotFoundException("Commision", "id", commisionId));
            Long id = userService.findCurrentUser().getId();
            if (clientService.isClient(id)) {
                if (!commision.getClient().getBaseUser().getId().equals(id)) {
                    throw new IllegalArgumentException("El cliente no tiene permisos para rechazar esta comisión.");
                }
                if (commision.getStatus() == StatusCommision.WAITING_CLIENT) {
                    commision.setStatus(StatusCommision.REJECTED);
                } else {
                    throw new IllegalStateException("No puedes rechazar esta comisión en su estado actual.");
                }
            }
            if (artistService.isArtist(id)) {
                if (!commision.getArtist().getBaseUser().getId().equals(id)) {
                    throw new IllegalArgumentException("El artista no tiene permisos para rechazar esta comisión.");
                }
                if (commision.getStatus() == StatusCommision.REQUESTED ||
                        commision.getStatus() == StatusCommision.WAITING_ARTIST) {
                    commision.setStatus(StatusCommision.REJECTED);
                } else {
                    throw new IllegalStateException("No puedes rechazar esta comisión en su estado actual.");
                }
            }
            commisionRepository.save(commision);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    } 

    @Transactional
    public void acceptCommission(Long commisionId) throws Exception{
        try{
            Commision commision = commisionRepository.findById(commisionId)
                .orElseThrow(() -> new ResourceNotFoundException("Commision", "id", commisionId));
            Long id = userService.findCurrentUser().getId();
            Boolean slotsFull = commision.getArtist().getNumSlotsOfWork()
                    - commisionRepository.numSlotsCovered(commision.getArtist().getId()) <= 0;
            if (clientService.isClient(id)) {
                if (!commision.getClient().getBaseUser().getId().equals(id)) {
                    throw new IllegalArgumentException("El cliente no tiene permisos para aceptar esta comisión.");
                }
                if (commision.getStatus() == StatusCommision.NOT_PAID_YET) {
                    commision.setStatus(slotsFull ? StatusCommision.IN_WAIT_LIST : StatusCommision.ACCEPTED);                 
                    if (!slotsFull) {
                        StatusKanbanOrder statusKanban = commisionRepository
                                .getFirstStatusKanbanOfArtist(commision.getArtist().getId()).orElseThrow( () -> 
                                new ResourceNotFoundException("Antes de aceptar una comisión, créate un estado en el Kanban"));
                        commision.setStatusKanbanOrder(statusKanban);
                    }
                } else {
                    throw new IllegalStateException("No puedes aceptar esta comisión en su estado actual.");
                }
            } else {
                throw new IllegalArgumentException("El artista no tiene permisos para aceptar esta comisión.");
            }
            commisionRepository.save(commision);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Transactional
    public void cancelCommission(Long commisionId) throws Exception{
        try{
            Commision commision = commisionRepository.findById(commisionId)
                .orElseThrow(() -> new ResourceNotFoundException("Commision", "id", commisionId));
            Long id = userService.findCurrentUser().getId();
            if (!commision.getClient().getBaseUser().getId().equals(id) &&
                    !commision.getArtist().getBaseUser().getId().equals(id)) {
                throw new IllegalArgumentException("Usted no tiene permisos para cancelar esta comisión.");
            }
            if (!(commision.getStatus() == StatusCommision.IN_WAIT_LIST ||
                    commision.getStatus() == StatusCommision.ACCEPTED)) {
                throw new IllegalStateException("La comisión no puede ser cancelada en su estado actual.");
            }
            commision.setStatus(StatusCommision.CANCELED);
            commisionRepository.save(commision);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public HistoryCommisionsDTO getHistoryOfCommissions() throws Exception {
        try {
            BaseUser user = userService.findCurrentUser();
            HistoryCommisionsDTO historyCommisionsDTO = new HistoryCommisionsDTO();

            if (user.hasAuthority("ARTIST"))
                fillDataForArtist(user.getId(), historyCommisionsDTO);
            else if (user.hasAuthority("CLIENT"))
                fillDataForClient(user.getId(), historyCommisionsDTO);
            else
                throw new IllegalAccessException(
                        "Error al intentar acceder al historial. Primero tienes que iniciar sesión");

            // Añade la información en los aceptados, del progreso en que se encuentra la
            // comisión
            for (ClientCommissionDTO commission : historyCommisionsDTO.getAccepted()) {
                Integer totalSteps = statusKanbanOrderService.countByArtistUsername(commission.getArtistUsername());
                commission.setTotalSteps(totalSteps);
            }

            return historyCommisionsDTO;
        } catch (Exception e) {
            throw e;
        }
    }

    private void fillDataForArtist(Long userId, HistoryCommisionsDTO historyCommisionsDTO) {
        historyCommisionsDTO.setRequested(
                commisionRepository.findCommisionsFilteredByArtistIdAndPermittedStatus(
                        userId,
                        List.of(StatusCommision.REQUESTED, StatusCommision.WAITING_ARTIST,
                                StatusCommision.WAITING_CLIENT, StatusCommision.NOT_PAID_YET)));

        historyCommisionsDTO.setAccepted(commisionRepository.findCommissionsInProgressByArtist(userId));

        historyCommisionsDTO.setHistory(
                commisionRepository.findCommisionsFilteredByArtistIdAndPermittedStatus(
                        userId,
                        List.of(StatusCommision.REJECTED, StatusCommision.NOT_PAID_YET, StatusCommision.IN_WAIT_LIST,
                                StatusCommision.CANCELED, StatusCommision.ENDED)));
    }

    private void fillDataForClient(Long userId, HistoryCommisionsDTO historyCommisionsDTO) {
        historyCommisionsDTO.setRequested(
                commisionRepository.findCommisionsFilteredByClientIdAndPermittedStatus(
                        userId,
                        List.of(StatusCommision.REQUESTED, StatusCommision.WAITING_ARTIST, StatusCommision.WAITING_CLIENT, StatusCommision.NOT_PAID_YET)));

        historyCommisionsDTO.setAccepted(commisionRepository.findCommissionsInProgressByClient(userId));

        historyCommisionsDTO.setHistory(
                commisionRepository.findCommisionsFilteredByClientIdAndPermittedStatus(
                        userId,
                        List.of(StatusCommision.REJECTED, StatusCommision.IN_WAIT_LIST,
                                StatusCommision.CANCELED, StatusCommision.ENDED)));
    }

    public boolean isStatusKanbanInUse(StatusKanbanOrder status) {
        return commisionRepository.existsByStatusKanban(status);
    }
    
}
