package com.HolosINC.Holos.artist;

import java.util.Optional;
import java.nio.file.AccessDeniedException;
import java.util.Collections;
import java.util.List;

import com.HolosINC.Holos.Category.ArtistCategory;
import com.HolosINC.Holos.Category.ArtistCategoryRepository;
import com.HolosINC.Holos.Kanban.StatusKanbanOrder;
import com.HolosINC.Holos.Kanban.StatusKanbanOrderService;
import com.HolosINC.Holos.commision.Commision;
import com.HolosINC.Holos.commision.CommisionRepository;
import com.HolosINC.Holos.commision.StatusCommision;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.model.BaseUserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ArtistService {

	private final ArtistRepository artistRepository;
	private final BaseUserRepository baseUserRepository;

	private final CommisionRepository commisionRepository;
	private final StatusKanbanOrderService statusKanbanOrderService;
	private final ArtistCategoryRepository artistCategoryRepository;

	@Autowired
	public ArtistService(ArtistRepository artistRepository, BaseUserRepository baseUserRepository, CommisionRepository commisionRepository, @Lazy StatusKanbanOrderService statusKanbanOrderService, ArtistCategoryRepository artistCategoryRepository) {
		this.artistRepository = artistRepository;
		this.baseUserRepository = baseUserRepository;
		this.commisionRepository = commisionRepository;
		this.statusKanbanOrderService = statusKanbanOrderService;
		this.artistCategoryRepository = artistCategoryRepository;
	}

	@Transactional
	public Artist saveArtist(Artist artist) throws DataAccessException {
		artistRepository.save(artist);
		return artist;
	}

	@Transactional(readOnly = true)
	public Artist findArtist(Long artistId) throws Exception {
		return artistRepository.findById(artistId)
				.orElseThrow(() -> new ResourceNotFoundException("Artist", "id", artistId));
	}

	@Transactional(readOnly = true)
	public Artist findArtistByUserId(Long artistId) throws Exception{
		return artistRepository.findByUserId(artistId)
				.orElseThrow(() -> new ResourceNotFoundException("Artist", "id", artistId));
	}

	@Transactional(readOnly = true)
	public Artist findArtistByUsername(String username) throws Exception{
		return artistRepository.findByUsername(username)
				.orElseThrow(() -> new ResourceNotFoundException("Artist", "username", username));
	}

	@Transactional(readOnly = true)
	public boolean isArtist(Long userId) throws Exception {
		return !(artistRepository.findByUserId(userId).isEmpty());
	}

	@Transactional
	public void deleteArtist(Long userId) throws Exception {
		try {
			Artist artist = artistRepository.findArtistByUser(userId)
				.orElseThrow(() -> new ResourceNotFoundException("Artist", "id", userId));
			Long artistId = artist.id;

			List<Commision> commisions = Optional.ofNullable(commisionRepository.findAll())
				.orElse(Collections.emptyList())
				.stream()
				.filter(c -> c.getArtist() != null && artistId.equals(c.getArtist().getId()))
				.toList();

			boolean hasAccepted = commisions.stream()
					.anyMatch(c -> c.getStatus() == StatusCommision.ACCEPTED);

			if (hasAccepted) {
				throw new AccessDeniedException("No se puede eliminar al artista porque tiene comisiones en estado ACCEPTED.");
			}

			commisionRepository.deleteAll(commisions);

			List<StatusKanbanOrder> kanbanStatuses = statusKanbanOrderService.findAllStatusKanbanOrderByArtist(artistId);
			for (StatusKanbanOrder sk : kanbanStatuses) {
				statusKanbanOrderService.deleteStatusKanbanOrder(sk.getId().intValue());
			}

			List<ArtistCategory> artistCategories = artistCategoryRepository.findAllByArtistId(artistId);
			if (!artistCategories.isEmpty()) {
				artistCategoryRepository.deleteAll(artistCategories);
			}

			if (artist.getBaseUser() != null) {
				baseUserRepository.deleteById(artist.getBaseUser().getId());
			}

			artistRepository.delete(artist);
		} catch (Exception e) {
			throw new ResourceNotFoundException("Error: El artista con ID " + userId + " no existe.");
		}
	}
	
	@Transactional
	public Optional<Artist> findByBaseUserId(Long baseUserId) throws Exception {
        return artistRepository.findByUserId(baseUserId);
    }
}
