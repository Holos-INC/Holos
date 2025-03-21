package com.HolosINC.Holos.Kanban;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.HolosINC.Holos.Kanban.DTOs.StatusKanbanDTO;
import com.HolosINC.Holos.Kanban.DTOs.StatusKanbanWithCommisionsDTO;

@Repository
public interface StatusKanbanOrderRepository extends JpaRepository<StatusKanbanOrder, Integer> {

    @Query("SELECT s FROM StatusKanbanOrder s WHERE s.order = :order_client AND s.artist.id = :id")
    Optional<StatusKanbanOrder> findByOrderAndArtist(Integer order_client, Integer id);

    @Query("SELECT s FROM StatusKanbanOrder s WHERE s.artist.id = :artistId")
    List<StatusKanbanOrder> findByArtist(@Param("artistId") Integer artistId);

    @Query("SELECT new com.HolosINC.Holos.Kanban.DTOs.StatusKanbanWithCommisionsDTO(c.name, c.description, c.price, c.numMilestones, c.paymentArrangement, c.statusKanbanOrder.name)" +
    "FROM Commision c WHERE c.artist.baseUser.id = :artistId ORDER BY c.statusKanbanOrder.order")
    List<StatusKanbanWithCommisionsDTO> getAllCommisionsAcceptedOfArtist(Long artistId);

    @Query("SELECT new com.HolosINC.Holos.Kanban.DTOs.StatusKanbanDTO(s.name, s.order, s.description, s.color)" +
        "FROM StatusKanbanOrder s WHERE s.artist.baseUser.id = :artistId ORDER BY s.order")
    List<StatusKanbanDTO> getAllStatusOrdererOfArtist(Long artistId);
}

