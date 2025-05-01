package com.HolosINC.Holos.Kanban;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.HolosINC.Holos.Kanban.DTOs.StatusKanbanDTO;
import com.HolosINC.Holos.Kanban.DTOs.StatusKanbanWithCommisionsDTO;

@Repository
public interface StatusKanbanOrderRepository extends JpaRepository<StatusKanbanOrder, Long> {

    @Query("SELECT s FROM StatusKanbanOrder s WHERE s.order = :order_client AND s.artist.id = :id")
    Optional<StatusKanbanOrder> findByOrderAndArtist(Integer order_client, Integer id);

    @Query("SELECT s FROM StatusKanbanOrder s WHERE s.artist.id = :artistId")
    List<StatusKanbanOrder> findByArtist(Integer artistId);

    List<StatusKanbanOrder> findByArtistIdOrderByOrderAsc(Long artistId);

    @Query("SELECT s FROM StatusKanbanOrder s WHERE s.artist.id = :artistId AND s.order > :order ORDER BY order ASC")
    List<StatusKanbanOrder> findByArtistIdOrderByOrderAscFiltered(Long artistId, Integer order);

    @Query("SELECT new com.HolosINC.Holos.Kanban.DTOs.StatusKanbanWithCommisionsDTO(c.id, c.name, c.description, c.price, c.paymentArrangement, c.statusKanbanOrder.name, c.client.baseUser.username, c.isWaitingPayment)" +
    "FROM Commision c WHERE c.artist.baseUser.id = :artistId ORDER BY c.statusKanbanOrder.order")
    List<StatusKanbanWithCommisionsDTO> getAllCommisionsAcceptedOfArtist(Long artistId);

    @Query("SELECT new com.HolosINC.Holos.Kanban.DTOs.StatusKanbanDTO(s.id, s.name, s.order, s.description, s.color)" +
        "FROM StatusKanbanOrder s WHERE s.artist.baseUser.id = :artistId ORDER BY s.order")
    List<StatusKanbanDTO> getAllStatusOrdererOfArtist(Long artistId);

    @Query("SELECT c.statusKanbanOrder FROM Commision c WHERE c.id = :commisionId")
    StatusKanbanOrder actualStatusKanban(Long commisionId);

    @Query("SELECT s FROM StatusKanbanOrder s WHERE s.artist.id = :id AND s.order = :nextOrder")
    Optional<StatusKanbanOrder> statusKanbanOfOrder(Long id, int nextOrder);

    @Query("SELECT COUNT(s) FROM StatusKanbanOrder s WHERE s.artist.baseUser.username = :username")
    Integer countByArtistUsername(String username);

}

