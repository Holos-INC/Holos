package com.HolosINC.Holos.search;


import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.artist.ArtistRepository;
import com.HolosINC.Holos.exceptions.ResourceNotOwnedException;
import com.HolosINC.Holos.search.DTOs.SearchWorkDTO;
import com.HolosINC.Holos.work.WorkRepository;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class SearchService {

    private final ArtistRepository artistRepository;
    private final WorkRepository workRepository;

    @Autowired
    public SearchService(ArtistRepository artistRepository, WorkRepository workRepository) {
        this.artistRepository = artistRepository;
        this.workRepository = workRepository;
    }

    public Page<SearchWorkDTO> searchWorks(String query, Double minPrice, Double maxPrice, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        if (minPrice != null && maxPrice != null && minPrice > maxPrice) {
            throw new ResourceNotOwnedException("minPrice no puede ser mayor que maxPrice.");
        }

        if (page < 0) {
            throw new ResourceNotOwnedException("El número de página no puede ser negativo.");
        }

        if (query != null && (minPrice != null || maxPrice != null)) {
            return workRepository.searchByTitleAndPrice(query, minPrice, maxPrice, pageable);
        }

        if (query != null) {
            return workRepository.searchByTitle(query, pageable);
        }

        if (minPrice != null || maxPrice != null) {
            return workRepository.searchByPriceRange(minPrice, maxPrice, pageable);
        }

        return workRepository.searchAll(pageable);
    }

    public Page<Artist> searchArtists(String query, Integer minWorksDone, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        if (minWorksDone != null && minWorksDone < 0) {
            throw new ResourceNotOwnedException("minWorksDone no puede ser negativo.");
        }

        if (query != null && minWorksDone != null) {
            return artistRepository.searchByNameAndWorksDone(query, minWorksDone, pageable);
        }

        if (query != null) {
            Page<Artist> byName = artistRepository.searchByName(query, pageable);
            Page<Artist> byUsername = artistRepository.searchByUsername(query, pageable);
            Page<Artist> byEmail = artistRepository.searchByEmail(query, pageable);

            List<Artist> combinedResults = Stream.concat(
                    Stream.concat(byName.getContent().stream(), byUsername.getContent().stream()),
                    byEmail.getContent().stream()).distinct().collect(Collectors.toList());

            return new PageImpl<>(combinedResults, pageable, combinedResults.size());
        }

        if (minWorksDone != null) {
            return artistRepository.searchByMinWorksDone(minWorksDone, pageable);
        }

        return artistRepository.findAll(pageable);
    }

    public Page<SearchWorkDTO> searchWorksByArtist(Integer artistId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return workRepository.searchByArtist(artistId, pageable);
    }

    public Page<Object> searchAll(String query, Integer minWorksDone, Double minPrice, Double maxPrice, int page,
            int size) {
        Pageable pageable = PageRequest.of(page, size);

        if (minPrice != null && maxPrice != null && minPrice > maxPrice) {
            throw new ResourceNotOwnedException("minPrice no puede ser mayor que maxPrice.");
        }

        if (minWorksDone != null && minWorksDone < 0) {
            throw new ResourceNotOwnedException("minWorksDone no puede ser negativo.");
        }

        Page<SearchWorkDTO> works = searchWorks(query, minPrice, maxPrice, page, size);
        Page<Artist> artists = searchArtists(query, minWorksDone, page, size);

        List<Object> combinedResults = Stream.concat(artists.getContent().stream(), works.getContent().stream())
                .collect(Collectors.toList());

        return new PageImpl<>(combinedResults, pageable, combinedResults.size());
    }
}
