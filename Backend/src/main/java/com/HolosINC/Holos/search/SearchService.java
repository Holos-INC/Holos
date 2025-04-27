package com.HolosINC.Holos.search;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.artist.ArtistRepository;
import com.HolosINC.Holos.exceptions.ResourceNotOwnedException;
import com.HolosINC.Holos.search.DTOs.SearchArtistDTO;
import com.HolosINC.Holos.search.DTOs.SearchWorkDTO;
import com.HolosINC.Holos.work.WorkRepository;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class SearchService {

    private final ArtistRepository artistRepository;
    private final WorkRepository workRepository;

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

    public Page<SearchArtistDTO> searchArtists(String query, Integer minWorksDone, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        if (minWorksDone != null && minWorksDone < 0) {
            throw new ResourceNotOwnedException("minWorksDone no puede ser negativo.");
        }

        List<Artist> artists;

        if (query != null && minWorksDone != null) {
            artists = artistRepository.searchByNameAndWorksDone(query, minWorksDone, Pageable.unpaged()).getContent();
        } else if (query != null) {
            List<Artist> byName = artistRepository.searchByName(query, Pageable.unpaged()).getContent();
            List<Artist> byUsername = artistRepository.searchByUsername(query, Pageable.unpaged()).getContent();
            List<Artist> byEmail = artistRepository.searchByEmail(query, Pageable.unpaged()).getContent();

            artists = Stream.concat(Stream.concat(byName.stream(), byUsername.stream()), byEmail.stream())
                    .distinct()
                    .collect(Collectors.toList());
        } else if (minWorksDone != null) {
            artists = artistRepository.searchByMinWorksDone(minWorksDone, Pageable.unpaged()).getContent();
        } else {
            artists = artistRepository.findAll(Pageable.unpaged()).getContent();
        }

        // Searching firstly for Premium Artists
        List<SearchArtistDTO> searchResults = artists.stream()
                .map(SearchArtistDTO::new)
                .sorted((a, b) -> Boolean.compare(!a.isPremium(), !b.isPremium()))
                .collect(Collectors.toList());

        // Pagination
        int start = Math.min((int) pageable.getOffset(), searchResults.size());
        int end = Math.min((start + pageable.getPageSize()), searchResults.size());
        List<SearchArtistDTO> pagedResults = searchResults.subList(start, end);

        return new PageImpl<>(pagedResults, pageable, searchResults.size());
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
        Page<SearchArtistDTO> artists = searchArtists(query, minWorksDone, page, size);

        List<Object> combinedResults = Stream.concat(artists.getContent().stream(), works.getContent().stream())
                .collect(Collectors.toList());

        return new PageImpl<>(combinedResults, pageable, combinedResults.size());
    }
}
