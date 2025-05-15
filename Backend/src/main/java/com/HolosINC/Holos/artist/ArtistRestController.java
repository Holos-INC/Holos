package com.HolosINC.Holos.artist;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.HolosINC.Holos.Profile.ProfileService;
import com.HolosINC.Holos.auth.payload.response.MessageResponse;
import com.HolosINC.Holos.model.BaseUserDTO;
import com.HolosINC.Holos.util.EntityToDTOMapper;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("api/v1/artists")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Artist", description = "API for managing artists")
class ArtistRestController {

    private final ArtistService artistService;
    private final ProfileService profileService;
    
    public ArtistRestController(ArtistService artistService, ProfileService profileService) {
        this.artistService = artistService;
        this.profileService = profileService;
    }
    
    @Operation(summary = "Update artist profile", description = "Update the profile of the artist with the provided information.")
    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(@RequestBody @Parameter(description = "Updated profile data for the artist") BaseUserDTO baseUserDTO) {
        try {
            BaseUserDTO updatedUserDTO = profileService.updateProfile(baseUserDTO);
            return ResponseEntity.ok(updatedUserDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @Operation(summary = "Get artist by ID", description = "Retrieve a specific artist's details using their ID.")
    @GetMapping(value = "/{id}")
    public ResponseEntity<?> findById(@PathVariable @Parameter(description = "ID of the artist to retrieve") Long id) {
        try {
            Artist artist = artistService.findArtist(id);
            ArtistDTO artistDTO = EntityToDTOMapper.toArtistDTO(artist);
            return ResponseEntity.ok().body(artistDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @Operation(summary = "Get artist by base user ID", description = "Retrieve an artist's details using the ID of their associated base user.")
    @GetMapping(value = "/byBaseUser/{baseUserId}")
    public ResponseEntity<?> findByBaseUserId(@PathVariable @Parameter(description = "ID of the base user associated with the artist") Long baseUserId) {
        try {
            Artist artist = artistService.findArtistByUserId(baseUserId);
            ArtistDTO artistDTO = EntityToDTOMapper.toArtistDTO(artist);
            return ResponseEntity.ok().body(artistDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @Operation(summary = "Get artist by username", description = "Retrieve an artist's details using their username.")
    @GetMapping(value = "/username/{username}")
    public ResponseEntity<?> findByUsername(@PathVariable @Parameter(description = "Username of the artist to retrieve") String username) {
        try {
            Artist artist = artistService.findArtistByUsername(username);
            ArtistDTO artistDTO = EntityToDTOMapper.toArtistDTO(artist);
            return ResponseEntity.ok(artistDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}
