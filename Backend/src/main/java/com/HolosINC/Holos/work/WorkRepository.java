package com.HolosINC.Holos.work;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkRepository extends JpaRepository<Work, Long>{
    
    @Query("SELECT w FROM Work w WHERE LOWER(w.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Work> searchByTitle(String query, Pageable pageable);

    //@Query("SELECT w FROM Work w WHERE (:category IS NULL OR LOWER(w.category) = LOWER(:category))")
    //Page<Work> searchByCategory(@Param("category") String category, Pageable pageable);

    @Query("SELECT w FROM Work w WHERE (:minPrice IS NULL OR w.price >= :minPrice) AND (:maxPrice IS NULL OR w.price <= :maxPrice)")
    Page<Work> searchByPriceRange(Double minPrice, Double maxPrice, Pageable pageable);

    @Query("SELECT w FROM Work w WHERE w.artist.id = :artistId")
    Page<Work> searchByArtist(Integer artistId, Pageable pageable);

    @Query("SELECT w FROM Work w WHERE LOWER(w.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
       "AND (:minPrice IS NULL OR w.price >= :minPrice) " +
       "AND (:maxPrice IS NULL OR w.price <= :maxPrice)")
    Page<Work> searchByTitleAndPrice(String query, Double minPrice, Double maxPrice, Pageable pageable);

    @Query(value = "SELECT * FROM works WHERE id = :id", nativeQuery = true)
    Optional<Work> findBaseWorkById(Long id);

    @Query(value = "SELECT w FROM Work w WHERE w.artist.id = :artistId")
    List<Work> findByArtistId(Long artistId);

    
}
