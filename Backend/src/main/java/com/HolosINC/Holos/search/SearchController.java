package com.HolosINC.Holos.search;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.work.Work;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/search")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Search Controller", description = "API for searching Works and Artists")
public class SearchController {

    private final SearchService searchService;

    @Autowired
    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping("/works")
    public ResponseEntity<Page<Work>> searchWorks(
        @RequestParam(required = false) String query,
        @RequestParam(required = false) Double minPrice,
        @RequestParam(required = false) Double maxPrice,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {

        Page<Work> results = searchService.searchWorks(query, minPrice, maxPrice, page, size);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/artists")
    public ResponseEntity<Page<Artist>> searchArtists(
        @RequestParam(required = false) String query,
        @RequestParam(required = false) Integer minWorksDone,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {

        Page<Artist> results = searchService.searchArtists(query, minWorksDone, page, size);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/artists/{artistId}/works")
    public ResponseEntity<Page<Work>> searchWorksByArtist(
        @PathVariable Integer artistId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {

        Page<Work> results = searchService.searchWorksByArtist(artistId, page, size);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/all")
    public ResponseEntity<Page<Object>> searchAll(
        @RequestParam(required = false) String query,
        @RequestParam(required = false) Integer minWorksDone,
        @RequestParam(required = false) Double minPrice,
        @RequestParam(required = false) Double maxPrice,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {

        Page<Object> results = searchService.searchAll(query, minWorksDone, minPrice, maxPrice, page, size);
        return ResponseEntity.ok(results);
    }

}

