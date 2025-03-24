package com.HolosINC.Holos.artist;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ArtistRepository extends JpaRepository<Artist, Long> {

    @Query("SELECT COUNT(*) > 0 FROM Artist a WHERE a.id = :id")
    boolean isArtist(Long id);

    @Query("SELECT a FROM Artist a WHERE LOWER(a.baseUser.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Artist> searchByName(String query, Pageable pageable);

    @Query("SELECT a FROM Artist a WHERE LOWER(a.baseUser.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Artist> searchByUsername(String query, Pageable pageable);

    @Query("SELECT a FROM Artist a WHERE LOWER(a.baseUser.email) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Artist> searchByEmail(String query, Pageable pageable);

    @Query("SELECT a FROM Artist a WHERE " +
       "(:minWorksDone IS NULL OR " +
       "(SELECT COUNT(wd) FROM WorksDone wd WHERE wd.artist = a) >= :minWorksDone)")
    Page<Artist> searchByMinWorksDone(Integer minWorksDone, Pageable pageable);

    @Query("SELECT a FROM Artist a WHERE " +
       "(LOWER(a.baseUser.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
       "OR LOWER(a.baseUser.username) LIKE LOWER(CONCAT('%', :query, '%')) " +
       "OR LOWER(a.baseUser.email) LIKE LOWER(CONCAT('%', :query, '%'))) " +
       "AND (:minWorksDone IS NULL OR " +
       "(SELECT COUNT(wd) FROM WorksDone wd WHERE wd.artist = a) >= :minWorksDone)")
    Page<Artist> searchByNameAndWorksDone(String query, Integer minWorksDone, Pageable pageable);

   @Query("SELECT a FROM Artist a WHERE a.baseUser.id = :id")
   Optional<Artist> findArtistByUser(Long id);

   @Query("SELECT a FROM Artist a WHERE a.username = :username")
   Optional<Artist> findByUsername(String username);

   @Query("SELECT a FROM Artist a WHERE a.baseUser.id = :id")
   Optional<Artist> findByUserId(Long id);
}

