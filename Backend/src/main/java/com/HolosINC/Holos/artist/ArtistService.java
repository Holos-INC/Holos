package com.HolosINC.Holos.artist;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;

import com.HolosINC.Holos.Category.ArtistCategory;
import com.HolosINC.Holos.Category.ArtistCategoryRepository;
import com.HolosINC.Holos.Kanban.StatusKanbanOrder;
import com.HolosINC.Holos.Kanban.StatusKanbanOrderService;
import com.HolosINC.Holos.auth.Authorities;
import com.HolosINC.Holos.auth.AuthoritiesRepository;
import com.HolosINC.Holos.commision.Commision;
import com.HolosINC.Holos.commision.CommisionRepository;
import com.HolosINC.Holos.commision.StatusCommision;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.milestone.Milestone;
import com.HolosINC.Holos.milestone.MilestoneService;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class ArtistService {

	private final ArtistRepository artistRepository;
	private BaseUserRepository baseUserRepository;
	private AuthoritiesRepository authoritiesRepository;

	private CommisionRepository commisionRepository;
	private MilestoneService milestoneService;
	private StatusKanbanOrderService statusKanbanOrderService;
	private ArtistCategoryRepository artistCategoryRepository;

	@Autowired
	public ArtistService(ArtistRepository artistRepository, BaseUserRepository baseUserRepository, AuthoritiesRepository authoritiesRepository, CommisionRepository commisionRepository, MilestoneService milestoneService, StatusKanbanOrderService statusKanbanOrderService, ArtistCategoryRepository artistCategoryRepository) {
		this.artistRepository = artistRepository;
		this.baseUserRepository = baseUserRepository;
		this.authoritiesRepository = authoritiesRepository;
		this.commisionRepository = commisionRepository;
		this.milestoneService = milestoneService;
		this.statusKanbanOrderService = statusKanbanOrderService;
		this.artistCategoryRepository = artistCategoryRepository;
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

	@Transactional
    public Artist updateArtist(Long artistId, Artist updatedArtist) {
        try {
        	
			Artist artist = artistRepository.findById(artistId)
                    .orElseThrow(() -> {
                        return new ResourceNotFoundException("Artist", "id", artistId);
                    });

            artist.setNumSlotsOfWork(updatedArtist.getNumSlotsOfWork());

            Artist savedArtist = artistRepository.save(artist);
            return savedArtist;

        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("No se puede actualizar el artista con ID " + artistId +
                                       " debido a restricciones de integridad.");
        } catch (Exception e) {
            throw new RuntimeException("Error interno al actualizar el artista con ID " + artistId);
        }
    }

	@Transactional
	public void deleteArtist(Long artistId) {
		try {
			Artist artist = artistRepository.findById(artistId)
					.orElseThrow(() -> new ResourceNotFoundException("Artist", "id", artistId));

			List<Commision> commisions = commisionRepository.findAll().stream()
					.filter(c -> c.getArtist() != null && artistId.equals(c.getArtist().getId()))
					.toList();

			boolean hasAccepted = commisions.stream()
					.anyMatch(c -> c.getStatus() == StatusCommision.ACCEPTED);

			if (hasAccepted) {
				throw new IllegalStateException("No se puede eliminar al artista porque tiene comisiones en estado ACCEPTED.");
			}

			for (Commision c : commisions) {
				List<Milestone> milestones = milestoneService.getByCommisionId(c.getId());
				for (Milestone m : milestones) {
					milestoneService.delete(m.getId());
				}
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

			artistRepository.deleteById(artistId);

		} catch (ResourceNotFoundException e) {
			throw new ResourceNotFoundException("Error: El artista con ID " + artistId + " no existe.");
		} catch (IllegalStateException e) {
			throw e;
		} catch (Exception e) {
			throw new RuntimeException("Error al eliminar el artista con ID " + artistId + ": " + e.getMessage());
		}
	}

	@Transactional
	public Artist createArtist(Artist artist) {
		try {
			if (baseUserRepository.findUserByUsername(artist.getBaseUser().getUsername()).isPresent()) {
				throw new IllegalStateException("El usuario con username " + artist.getBaseUser().getUsername() + " ya existe.");
			}

			BaseUser baseUser = new BaseUser();
			baseUser.setName(artist.getBaseUser().getName());
			baseUser.setUsername(artist.getBaseUser().getUsername());
			baseUser.setEmail(artist.getBaseUser().getEmail());
			baseUser.setPassword(artist.getBaseUser().getPassword());
			baseUser.setPhoneNumber(artist.getBaseUser().getPhoneNumber());
			baseUser.setCreatedUser(new Date());

			Authorities artistRole = authoritiesRepository.findByName("ARTIST")
					.orElseThrow(() -> new RuntimeException("Rol ARTIST no encontrado"));
			baseUser.setAuthority(artistRole);

			baseUser = baseUserRepository.save(baseUser);
			
			artist.setBaseUser(baseUser);
			artist.setNumSlotsOfWork(artist.getNumSlotsOfWork() != null ? artist.getNumSlotsOfWork() : 1);

			Artist savedArtist = artistRepository.save(artist);
			return savedArtist;

		} catch (IllegalStateException e) {
			throw e;
		} catch (Exception e) {
			throw new RuntimeException("Error interno al crear el artista.");
		}
	}

	public Artist findByUsername(String username) {
        return artistRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Artist", "username", username));
    }

	public boolean isBanned(Artist artist) {
		if (artist == null)
			return false;
		return artist.getBaseUser().getIsBanned();
	}	

}
