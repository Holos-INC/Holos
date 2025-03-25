package com.HolosINC.Holos.commision;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.HolosINC.Holos.Kanban.StatusKanbanOrder;
import com.HolosINC.Holos.client.Client;
import com.HolosINC.Holos.commision.DTOs.ClientCommissionDTO;

@Repository
public interface CommisionRepository extends JpaRepository<Commision, Long>{
    
    @Query("SELECT COUNT(c) FROM Commision c WHERE c.artist.id = :artistId AND c.status = 'ACCEPTED'")
    Integer numSlotsCovered(Long artistId);

    @Query("SELECT c FROM Commision c WHERE c.client.id = :clientId")
    List<Commision> findAllByClientId(Long clientId);
    @Query("SELECT s FROM StatusKanbanOrder s WHERE s.order = (SELECT MIN(s.order) FROM StatusKanbanOrder s)")
    Optional<StatusKanbanOrder> getFirstStatusKanbanOfArtist(Long artistId);

    @Query("SELECT c FROM Commision c WHERE c.artist.baseUser.id = :artistId AND c.status IN ('REQUESTED', 'WAITING_ARTIST')")
    List<Commision> findAllPendingCommisionsByArtistId(Long artistId);

    @Query("SELECT c FROM Commision c WHERE c.client.baseUser.id = :clientId AND c.status = 'WAITING_CLIENT'")
    List<Commision> findAllPendingCommisionsByClientId(Long clientId);
    // @Query("SELECT c FROM Commision c WHERE c.artist.baseUser.id = :artistId AND c.status = 'REQUESTED'")
    // List<Commision> findAllPendingCommisionsByArtistId(@Param("artistId") Long artistId);

    @Query(" SELECT new com.HolosINC.Holos.commision.DTOs.ClientCommissionDTO(c.image, c.name, c.artist.baseUser.username, c.statusKanbanOrder.order,0)"+
        "FROM Commision c WHERE c.client = :client") // Obliga a que el orden sea serializado
    List<ClientCommissionDTO> findAllForClient(Client client);
}
