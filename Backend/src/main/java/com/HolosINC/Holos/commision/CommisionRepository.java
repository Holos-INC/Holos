package com.HolosINC.Holos.commision;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.HolosINC.Holos.Kanban.StatusKanbanOrder;
import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.commision.DTOs.ClientCommissionDTO;
import com.HolosINC.Holos.commision.DTOs.CommissionDTO;

@Repository
public interface CommisionRepository extends JpaRepository<Commision, Long>{
    
    @Query("SELECT COUNT(c) FROM Commision c WHERE c.artist.id = :artistId AND c.status = 'ACCEPTED'")
    Integer numSlotsCovered(Long artistId);

    @Query("SELECT s FROM StatusKanbanOrder s WHERE s.artist.id = :artistId AND s.order = (SELECT MIN(s.order) FROM StatusKanbanOrder s)")
    Optional<StatusKanbanOrder> getFirstStatusKanbanOfArtist(Long artistId);

    @Query("SELECT new com.HolosINC.Holos.commision.DTOs.CommissionDTO(c)" +
    " FROM Commision c WHERE c.artist.baseUser.id = :artistId AND c.status IN :permitted")
    List<CommissionDTO> findCommisionsFilteredByArtistIdAndPermittedStatus(Long artistId, List<StatusCommision> permitted);

    @Query("SELECT new com.HolosINC.Holos.commision.DTOs.CommissionDTO(c)" +
    " FROM Commision c WHERE c.client.baseUser.id = :clientId AND c.status IN :permitted")
    List<CommissionDTO> findCommisionsFilteredByClientIdAndPermittedStatus(Long clientId, List<StatusCommision> permitted);

    @Query("SELECT new com.HolosINC.Holos.commision.DTOs.ClientCommissionDTO(c) FROM Commision c WHERE c.client.baseUser.id = :clientId AND c.status = ACCEPTED")
    List<ClientCommissionDTO> findCommissionsInProgressByClient(Long clientId);//Cambio backend: he añadido el id y el username de artista o cliente

    @Query("SELECT new com.HolosINC.Holos.commision.DTOs.ClientCommissionDTO(c) FROM Commision c WHERE c.artist.baseUser.id = :artistId AND c.status = ACCEPTED")
    List<ClientCommissionDTO> findCommissionsInProgressByArtist(Long artistId);//Cambio backend: he añadido el id y el username de artista o cliente

    @Query("SELECT c FROM Commision c WHERE c.client.id = :clientId")
    List<Commision> findAllByClientId(Long clientId);

    @Query("SELECT COUNT(c) > 0 FROM Commision c WHERE c.statusKanbanOrder = :status")
    boolean existsByStatusKanban(StatusKanbanOrder status);


    // Buscar la comisión más antigua en IN_WAIT_LIST
    Optional<Commision> findFirstByStatusAndArtistOrderByAcceptedDateByArtistAsc(StatusCommision status, Artist artist);

    @Query("SELECT c.id FROM Commision c WHERE c.paymentIntentId = :paymentIntentId")
    Long findCommissionIdByPaymentIntentId(@Param("paymentIntentId") String paymentIntentId);
}
