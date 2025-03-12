package com.HolosINC.Holos.Kanban;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface StatusKanbanOrderRepository extends JpaRepository<StatusKanbanOrder, Integer> {

    @Query("SELECT s FROM StatusKanbanOrder s WHERE s.order = :order_client AND s.artist.id = :id")
    Optional<StatusKanbanOrder> findByOrderAndArtist(Integer order_client, Integer id);

    @Query("SELECT s FROM StatusKanbanOrder s WHERE s.artist.id = :artistId")
    List<StatusKanbanOrder> findByArtist(@Param("artistId") Long artistId);
}

