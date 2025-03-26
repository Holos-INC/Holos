package com.HolosINC.Holos.artist;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;

import com.HolosINC.Holos.Category.ArtistCategory;
import com.HolosINC.Holos.Category.ArtistCategoryRepository;
import com.HolosINC.Holos.Category.CategoryService;
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
import com.HolosINC.Holos.work.Work;
import com.HolosINC.Holos.work.WorkService;

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
	private final WorkService workService;
	private final CategoryService categoryService;

	@Autowired
	public ArtistService(ArtistRepository artistRepository, BaseUserRepository baseUserRepository, AuthoritiesRepository authoritiesRepository, CommisionRepository commisionRepository, MilestoneService milestoneService, StatusKanbanOrderService statusKanbanOrderService, ArtistCategoryRepository artistCategoryRepository, WorkService workService, CategoryService categoryService) {
		this.artistRepository = artistRepository;
		this.baseUserRepository = baseUserRepository;
		this.authoritiesRepository = authoritiesRepository;
		this.commisionRepository = commisionRepository;
		this.milestoneService = milestoneService;
		this.statusKanbanOrderService = statusKanbanOrderService;
		this.artistCategoryRepository = artistCategoryRepository;
		this.workService = workService;
		this.categoryService = categoryService;
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
	public void deleteArtistIfNoAcceptedCommisions(Long artistId) {
		try {
			Artist artist = artistRepository.findByUserId(artistId)
				.orElseThrow(() -> new ResourceNotFoundException("Artist", "id", artistId));

			Long userId = artist.getBaseUser().getId();

			boolean hasAcceptedCommisions = commisionRepository
				.existsByArtistIdAndStatus(artistId, StatusCommision.ACCEPTED);

			if (hasAcceptedCommisions) {
				throw new IllegalStateException("El artista tiene comisiones aceptadas y no puede ser eliminado.");
			}

			workService.deleteWorksByArtistId(artistId);
			statusKanbanOrderService.deleteAllByArtistId(artistId);
			categoryService.deleteAllByArtistId(artistId);

			artistRepository.delete(artist);
			baseUserRepository.deleteById(userId);

		} catch (ResourceNotFoundException e) {
			throw e;
		} catch (IllegalStateException e) {
			throw e;
		} catch (Exception e) {
			throw new RuntimeException("Error al intentar eliminar el artista con ID " + artistId, e);
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
	
	
	public void deleteArtistIfPossible(Long artistId) {
		
		Artist artist = artistRepository.findByUserId(artistId)
				.orElseThrow(() -> new ResourceNotFoundException("Artist", "id", artistId));

		// Verifica si el artista tiene trabajos asociados
		List<Work> works = workService.getWorksByArtist(artist);
		if (!works.isEmpty()) {
			throw new IllegalStateException("No se puede eliminar el artista porque tiene trabajos asociados.");
		}
	
		boolean hasAcceptedCommisions = commisionRepository
				.existsByArtistIdAndStatus(artistId, StatusCommision.ACCEPTED);

			if (hasAcceptedCommisions) {
				throw new IllegalStateException("El artista tiene comisiones aceptadas y no puede ser eliminado.");
			}
	
		// Elimina asociaciones de categorías del artista (si se desea)
		categoryService.deleteAllByArtistId(artistId);
	
		// Elimina estados Kanban relacionados
		statusKanbanOrderService.deleteAllByArtistId(artistId);
	
		// Finalmente, elimina el artista
		artistRepository.delete(artist);
	}
	

}
