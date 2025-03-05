package com.HolosINC.Holos.artist;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/v1/artists")
@SecurityRequirement(name = "bearerAuth")
class ArtistRestController {

	private final ArtistService artistService;

	@Autowired
	public ArtistRestController(ArtistService artistService) {
		this.artistService = artistService;
	}

	@GetMapping(value = "{id}")
	public ResponseEntity<Artist> findById(@PathVariable("id") Long id) {
		return new ResponseEntity<>(artistService.findArtist(id), HttpStatus.OK);
	}

}
