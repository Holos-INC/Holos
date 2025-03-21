package com.HolosINC.Holos.artist;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.HolosINC.Holos.exceptions.ResourceNotFoundException;

@Service
public class ArtistService {

	private final ArtistRepository artistRepository;

	@Autowired
	public ArtistService(ArtistRepository artistRepository) {
		this.artistRepository = artistRepository;
	}

	@Transactional
	public Artist saveArtist(Artist artist) throws DataAccessException {
		artistRepository.save(artist);
		return artist;
	}


	@Transactional(readOnly = true)
	public Artist findArtist(Long artistId) {
		return artistRepository.findArtistByUser(artistId)
				.orElseThrow(() -> new ResourceNotFoundException("Artist", "id", artistId));
	}

	@Transactional(readOnly = true)
	public Iterable<Artist> findAll() {
		return artistRepository.findAll();
	}
}
