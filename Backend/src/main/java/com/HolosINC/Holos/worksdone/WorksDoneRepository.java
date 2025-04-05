package com.HolosINC.Holos.worksdone;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorksDoneRepository extends JpaRepository<WorksDone, Long> {

    Long countByArtistId(Long artistId);

}
