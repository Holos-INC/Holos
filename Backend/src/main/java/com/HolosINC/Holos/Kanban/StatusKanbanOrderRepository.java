package com.HolosINC.Holos.Kanban;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.HolosINC.Holos.commision.Commision;

@Repository
public interface StatusKanbanOrderRepository extends JpaRepository<StatusKanbanOrder, Integer> {

    @Query("SELECT s FROM StatusKanbanOrder s WHERE s.order = :order_client AND s.artist.id = :id")
    Optional<StatusKanbanOrder> findByOrderAndArtist(Integer order_client, Integer id);

    @Query("SELECT s FROM StatusKanbanOrder s WHERE s.artist.id = :id")
    Collection<StatusKanbanOrder> findByArtist(Integer id);

}

