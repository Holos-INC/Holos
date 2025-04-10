package com.HolosINC.Holos.worksdone;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.HolosINC.Holos.artist.Artist;

@Repository
public interface WorksDoneRepository extends JpaRepository<WorksDone, Long> {
    
    // Los 3 artistas con mas publicaciones
    @Query("SELECT w.artist FROM WorksDone w GROUP BY w.artist ORDER BY COUNT(w) DESC LIMIT 3")
    List<Artist> findTop3ArtistsByWorksDone();

    Long countByArtistId(Long artistId);
}
