package com.HolosINC.Holos.artist;

import java.util.Optional;

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
		return artistRepository.findById(artistId)
				.orElseThrow(() -> new ResourceNotFoundException("Artist", "id", artistId));
	}

	@Transactional(readOnly = true)
	public Artist findArtistByUserId(Long artistId) {
		return artistRepository.findByUserId(artistId)
				.orElseThrow(() -> new ResourceNotFoundException("Artist", "id", artistId));
	}

	@Transactional(readOnly = true)
	public Artist findArtistByUsername(String username) {
		return artistRepository.findByUsername(username)
				.orElseThrow(() -> new ResourceNotFoundException("Artist", "username", username));
	}

	@Transactional
	public void deleteArtist(Long artistId) {
		artistRepository.deleteById(artistId);
	}
	
	@Transactional
	public Optional<Artist> findByBaseUserId(Long baseUserId) {
        return artistRepository.findByUserId(baseUserId);
    }
}
