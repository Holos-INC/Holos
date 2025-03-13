package com.HolosINC.Holos.commision;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.HolosINC.Holos.Kanban.StatusKanbanOrder;

@Repository
public interface CommisionRepository extends JpaRepository<Commision, Long>{
    
    @Query("SELECT COUNT(c) FROM Commision c WHERE c.artist.id = :artistId AND c.status = 'ACCEPTED'")
    Integer numSlotsCovered(Long artistId);

    @Query("SELECT c FROM Commision c WHERE c.statusKanbanOrder.id = :id")
    Collection<Commision> findAllCommissionsByStatusKanbanOrder(Long id);

    @Query("SELECT c FROM Commision c WHERE c.artist.username = :artistUsername")
    List<Commision> findByArtistUsername(String artistUsername);

    @Query("SELECT s FROM StatusKanbanOrder s WHERE s.artist.id = :idArtist AND s.order = :order")
    Optional<StatusKanbanOrder> findNextStatusKanban(Long idArtist, Integer order);
}
