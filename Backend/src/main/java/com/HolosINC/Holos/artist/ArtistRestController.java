package com.HolosINC.Holos.artist;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
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
    public ResponseEntity<?> updateProfile(@RequestBody BaseUserDTO baseUserDTO) {
        try{
            BaseUserDTO updatedUserDTO = profileService.updateProfile(baseUserDTO);
            return ResponseEntity.ok(updatedUserDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    
	}
	
	@GetMapping(value = "/{id}")
	@Operation(summary = "Get artist", description = "Retrieve a list of all artists")
	public ResponseEntity<?> findById(@PathVariable("id") Long id) {
		try{
            Artist artist = artistService.findArtist(id);
            ArtistDTO artistDTO = EntityToDTOMapper.toArtistDTO(artist);
            return ResponseEntity.ok().body(artistDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
	}

    
    @DeleteMapping("/administrator/artists/{id}")
    public ResponseEntity<MessageResponse> deleteArtist(@PathVariable Long id) {
        try {
            artistService.deleteArtist(id);
            return ResponseEntity.ok().body(new MessageResponse("Artista eliminado con exito"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

	@GetMapping(value = "username/{username}")
	@Operation(summary = "Get artist", description = "Retrieve a list of all artists")
    public ResponseEntity<MessageResponse> findByUsername(@PathVariable("username") String username) {
        try{
            Artist artist = artistService.findArtistByUsername(username);
            return ResponseEntity.ok().body(new MessageResponse(artist.toString()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
	}

}
