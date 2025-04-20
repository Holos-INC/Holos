package com.HolosINC.Holos.artist;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.HolosINC.Holos.Profile.ProfileService;
import com.HolosINC.Holos.auth.payload.response.MessageResponse;
import com.HolosINC.Holos.model.BaseUserDTO;
import com.HolosINC.Holos.util.EntityToDTOMapper;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("api/v1/artists")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Artist", description = "API for managing artists")
class ArtistRestController {

    private final ArtistService artistService;
    private final ProfileService profileService;

    @Autowired
    public ArtistRestController(ArtistService artistService, ProfileService profileService) {
        this.artistService = artistService;
        this.profileService = profileService;
    }

    @PutMapping("/update")
    @Operation(
        summary = "Update artist profile",
        description = "Updates the profile of the currently authenticated artist.",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Profile updated successfully",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = BaseUserDTO.class))
            ),
            @ApiResponse(
                responseCode = "400",
                description = "Invalid request or error during update",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = MessageResponse.class))
            )
        }
    )
    public ResponseEntity<?> updateProfile(@RequestBody BaseUserDTO baseUserDTO) {
        try {
            BaseUserDTO updatedUserDTO = profileService.updateProfile(baseUserDTO);
            return ResponseEntity.ok(updatedUserDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    @Operation(
        summary = "Get artist by ID",
        description = "Retrieves an artist's public profile by their ID.",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Artist found",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ArtistDTO.class))
            ),
            @ApiResponse(
                responseCode = "400",
                description = "Artist not found or error occurred",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = MessageResponse.class))
            )
        }
    )
    public ResponseEntity<?> findById(@PathVariable("id") Long id) {
        try {
            Artist artist = artistService.findArtist(id);
            ArtistDTO artistDTO = EntityToDTOMapper.toArtistDTO(artist);
            return ResponseEntity.ok().body(artistDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/administrator/artists/{id}")
    @Operation(
        summary = "Delete artist by ID (admin only)",
        description = "Deletes an artist from the system by their ID. This action is restricted to administrators.",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Artist successfully deleted",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = MessageResponse.class))
            ),
            @ApiResponse(
                responseCode = "400",
                description = "Error occurred during deletion",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = MessageResponse.class))
            )
        }
    )
    public ResponseEntity<?> deleteArtist(@PathVariable Long id) {
        try {
            artistService.deleteArtist(id);
            return ResponseEntity.ok().body(new MessageResponse("Artista eliminado con exito"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("username/{username}")
    @Operation(
        summary = "Get artist by username",
        description = "Retrieves an artist's public profile using their username.",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Artist found",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Artist.class))
            ),
            @ApiResponse(
                responseCode = "400",
                description = "Artist not found or error occurred",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = MessageResponse.class))
            )
        }
    )
    public ResponseEntity<?> findByUsername(@PathVariable("username") String username) {
        try {
            Artist artist = artistService.findArtistByUsername(username);
            return ResponseEntity.ok(artist);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}
