package com.HolosINC.Holos.work;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.HolosINC.Holos.search.DTOs.SearchWorkDTO;

@Repository
public interface WorkRepository extends JpaRepository<Work, Long>{
    
    @Query("SELECT new com.HolosINC.Holos.search.DTOs.SearchWorkDTO(w) FROM WorksDone w WHERE LOWER(w.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<SearchWorkDTO> searchByTitle(String query, Pageable pageable);

    //@Query("SELECT w FROM Work w WHERE (:category IS NULL OR LOWER(w.category) = LOWER(:category))")
    //Page<Work> searchByCategory(@Param("category") String category, Pageable pageable);

    @Query("SELECT new com.HolosINC.Holos.search.DTOs.SearchWorkDTO(w) FROM WorksDone w WHERE (:minPrice IS NULL OR w.price >= :minPrice) AND (:maxPrice IS NULL OR w.price <= :maxPrice)")
    Page<SearchWorkDTO> searchByPriceRange(Double minPrice, Double maxPrice, Pageable pageable);

    @Query("SELECT new com.HolosINC.Holos.search.DTOs.SearchWorkDTO(w) FROM WorksDone w WHERE w.artist.id = :artistId")
    Page<SearchWorkDTO> searchByArtist(Integer artistId, Pageable pageable);

    @Query("SELECT new com.HolosINC.Holos.search.DTOs.SearchWorkDTO(w) FROM WorksDone w WHERE LOWER(w.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
       "AND (:minPrice IS NULL OR w.price >= :minPrice) " +
       "AND (:maxPrice IS NULL OR w.price <= :maxPrice)")
    Page<SearchWorkDTO> searchByTitleAndPrice(String query, Double minPrice, Double maxPrice, Pageable pageable);
    
    @Query("SELECT new com.HolosINC.Holos.search.DTOs.SearchWorkDTO(w) FROM WorksDone w")
    Page<SearchWorkDTO> searchAll(Pageable pageable);
}
