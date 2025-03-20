package com.HolosINC.Holos.Category;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.HolosINC.Holos.artist.Artist;

@Repository
public interface ArtistCategoryRepository extends JpaRepository<ArtistCategory, Long> {
    

    @Query("SELECT COUNT(ac) > 0 FROM ArtistCategory ac WHERE ac.artist.id = :artistId AND ac.category.id = :categoryId")
    Boolean artistCategoryExist(Long artistId, Long categoryId);

    @Query("SELECT ac.category FROM ArtistCategory ac WHERE ac.artist.id = :artistId")
    List<Category> findCategoriesOfArtist(Long artistId);

    @Query("SELECT ac.artist FROM ArtistCategory ac WHERE ac.category.id = :categoryId")
    List<Artist> findArtistsByCategory(Long categoryId);
    
    @Query("SELECT ac FROM ArtistCategory ac WHERE ac.artist.id = :artistId AND ac.category.id = :categoryId")
    Optional<ArtistCategory> findByArtistAndCategory(Long artistId, Long categoryId);

    @Query("SELECT ac FROM ArtistCategory ac WHERE ac.category.id = :categoryId")
    List<ArtistCategory> findAllByCategoryId(Long categoryId);
}
