package com.HolosINC.Holos.artist;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.HolosINC.Holos.Profile.ProfileService;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.model.BaseUserDTO;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("api/v1/artists")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Artist", description = "API for managing artists")
class ArtistRestController {

	private final ArtistService artistService;

	@Autowired
	public ArtistRestController(ArtistService artistService) {
		this.artistService = artistService;
	}
	@Autowired
    private ProfileService profileService;

    @PutMapping("/update")
    public ResponseEntity<BaseUserDTO> updateProfile(@RequestBody BaseUserDTO baseUserDTO) {
        // Llamamos al servicio para actualizar el perfil y usamos findCurrentUser() para obtener el id
        BaseUserDTO updatedUserDTO = profileService.updateProfile(baseUserDTO);
        
        // Devolvemos el resultado de la actualización, que será el mismo DTO con los datos actualizados
        return ResponseEntity.ok(updatedUserDTO);
    
	}
	
	@GetMapping(value = "/{id}")
	@Operation(summary = "Get artist", description = "Retrieve a list of all artists")
	public ResponseEntity<Artist> findById(@PathVariable("id") Long id) {
		return new ResponseEntity<>(artistService.findArtist(id), HttpStatus.OK);
	}

    
    @DeleteMapping("/administrator/artists/{id}")
    public ResponseEntity<?> deleteArtist(@PathVariable Long id) {
        try {
            artistService.deleteArtist(id);
            return ResponseEntity.ok().body("Cliente eliminado exitosamente");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error interno al eliminar el artista: " + e.getMessage());
        }
    }

	@GetMapping(value = "username/{username}")
	@Operation(summary = "Get artist", description = "Retrieve a list of all artists")
	public ResponseEntity<Artist> findByUsername(@PathVariable("username") String username) {
		return new ResponseEntity<>(artistService.findArtistByUsername(username), HttpStatus.OK);
	}

}
