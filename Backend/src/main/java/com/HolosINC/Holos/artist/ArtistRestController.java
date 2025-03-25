package com.HolosINC.Holos.artist;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("api/v1/artists")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Artist", description = "API for managing artists")
class ArtistRestController {

	private final ArtistService artistService;
	private final BaseUserService baseUserService;

	@Autowired
	public ArtistRestController(ArtistService artistService,BaseUserService baseUserService) {
		this.artistService = artistService;
		this.baseUserService = baseUserService;
	}

	@GetMapping(value = "/{id}")
	@Operation(summary = "Get artist", description = "Retrieve a list of all artists")
	public ResponseEntity<Artist> findById(@PathVariable("id") Long id) {
		return new ResponseEntity<>(artistService.findArtist(id), HttpStatus.OK);
	}

	@GetMapping("/administrator/artists")
    public ResponseEntity<List<BaseUser>> getAllArtists() {
        return ResponseEntity.ok(baseUserService.getAllUsersByRole("ARTIST"));
    }

	@GetMapping("/administrator/artists/{id}")
    public ResponseEntity<Artist> getArtistById(@PathVariable Long id) {
        try {
            Artist artist = artistService.findArtist(id);
            return ResponseEntity.ok(artist);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(null);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

	@PostMapping("/administrator/artists/{id}")
    public ResponseEntity<?> createArtist(@RequestBody Artist artist) {
        try {
            Artist createdArtist = artistService.createArtist(artist);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdArtist);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error interno al crear el artista.");
        }
    }

	@PutMapping("/administrator/artists/{id}")
    public ResponseEntity<Artist> updateArtist(@PathVariable Long id, @RequestBody Artist updatedArtist) {
        try {
            Artist artist = artistService.updateArtist(id, updatedArtist);
            return ResponseEntity.ok(artist);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }
    
    @DeleteMapping("/administrator/artists/{id}")
    public ResponseEntity<?> deleteArtist(@PathVariable Long id) {
        try {
            artistService.deleteArtist(id);
            return ResponseEntity.ok().body("Artista eliminado exitosamente");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error interno al eliminar el artista");
        }
    }

}
