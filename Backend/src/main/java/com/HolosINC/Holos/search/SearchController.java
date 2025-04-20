package com.HolosINC.Holos.search;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.exceptions.ResourceNotOwnedException;
import com.HolosINC.Holos.search.DTOs.SearchWorkDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @Operation(
        summary = "Search for works",
        description = "Performs a search for artworks based on text query and optional price range."
    )
    @ApiResponse(
        responseCode = "200",
        description = "Page of matching works",
        content = @Content(mediaType = "application/json", schema = @Schema(implementation = SearchWorkDTO.class))
    )
    @GetMapping("/works")
    public ResponseEntity<Page<SearchWorkDTO>> searchWorks(
        @Parameter(description = "Text to search in works") @RequestParam(required = false) String query,
        @Parameter(description = "Minimum price") @RequestParam(required = false) Double minPrice,
        @Parameter(description = "Maximum price") @RequestParam(required = false) Double maxPrice,
        @Parameter(description = "Page number (default: 0)") @RequestParam(defaultValue = "0") int page,
        @Parameter(description = "Page size (default: 10)") @RequestParam(defaultValue = "10") int size) {

        Page<SearchWorkDTO> results = searchService.searchWorks(query, minPrice, maxPrice, page, size);
        return ResponseEntity.ok(results);
    }

    @Operation(
        summary = "Search for artists",
        description = "Search artists by text query and/or minimum number of works done."
    )
    @ApiResponse(
        responseCode = "200",
        description = "Page of matching artists",
        content = @Content(mediaType = "application/json", schema = @Schema(implementation = Artist.class))
    )
    @GetMapping("/artists")
    public ResponseEntity<Page<Artist>> searchArtists(
        @Parameter(description = "Text to search in artist fields") @RequestParam(required = false) String query,
        @Parameter(description = "Minimum number of works done") @RequestParam(required = false) Integer minWorksDone,
        @Parameter(description = "Page number (default: 0)") @RequestParam(defaultValue = "0") int page,
        @Parameter(description = "Page size (default: 10)") @RequestParam(defaultValue = "10") int size) {

        Page<Artist> results = searchService.searchArtists(query, minWorksDone, page, size);
        return ResponseEntity.ok(results);
    }

    @Operation(
        summary = "Get works by artist",
        description = "Returns a paginated list of works made by a specific artist."
    )
    @ApiResponse(
        responseCode = "200",
        description = "Page of works by artist",
        content = @Content(mediaType = "application/json", schema = @Schema(implementation = SearchWorkDTO.class))
    )
    @GetMapping("/artists/{artistId}/works")
    public ResponseEntity<Page<SearchWorkDTO>> searchWorksByArtist(
        @Parameter(description = "ID of the artist") @PathVariable Integer artistId,
        @Parameter(description = "Page number (default: 0)") @RequestParam(defaultValue = "0") int page,
        @Parameter(description = "Page size (default: 10)") @RequestParam(defaultValue = "10") int size) {

        Page<SearchWorkDTO> results = searchService.searchWorksByArtist(artistId, page, size);
        return ResponseEntity.ok(results);
    }

    @Operation(
        summary = "Global search for works and artists",
        description = "Performs a combined search on works and artists with multiple filters."
    )
    @ApiResponse(
        responseCode = "200",
        description = "Page of combined search results (works and artists)",
        content = @Content(mediaType = "application/json")
    )
    @GetMapping("/all")
    public ResponseEntity<Page<Object>> searchAll(
        @Parameter(description = "Text to search in works and artists") @RequestParam(required = false) String query,
        @Parameter(description = "Minimum number of works done (artist)") @RequestParam(required = false) Integer minWorksDone,
        @Parameter(description = "Minimum price of works") @RequestParam(required = false) Double minPrice,
        @Parameter(description = "Maximum price of works") @RequestParam(required = false) Double maxPrice,
        @Parameter(description = "Page number (default: 0)") @RequestParam(defaultValue = "0") int page,
        @Parameter(description = "Page size (default: 10)") @RequestParam(defaultValue = "10") int size) {

        Page<Object> results = searchService.searchAll(query, minWorksDone, minPrice, maxPrice, page, size);
        return ResponseEntity.ok(results);
    }

    @ExceptionHandler(ResourceNotOwnedException.class)
    public ResponseEntity<String> handleInvalidParams(ResourceNotOwnedException ex) {
        return ResponseEntity.badRequest().body("Error: " + ex.getMessage());
    }
}
