package com.HolosINC.Holos.worksdone;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.artist.ArtistService;
import com.HolosINC.Holos.auth.Auth;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.model.BaseUserService;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorksDoneService {

    private final WorksDoneRepository worksDoneRepository;
    private final ArtistService artistService;
    private final BaseUserService baseUserService;

    public WorksDoneService(WorksDoneRepository worksDoneRepository, ArtistService artistService, BaseUserService baseUserService) {
        this.worksDoneRepository = worksDoneRepository;
        this.artistService = artistService;
        this.baseUserService = baseUserService;
    }


    public WorksDone createWorksDone(WorksDone worksDone) throws Exception {
        try {
            if (worksDone.getImage().length > 5 * 1024 * 1024) 
                throw new IllegalArgumentException("La imagen de perfil no puede ser mayor a 5MB.");
            
            Long currentUserId = baseUserService.findCurrentUser().getId();
            Artist artist = baseUserService.findArtist(currentUserId);
            boolean isPremium = artist.getBaseUser().getAuthority() == Auth.ARTIST_PREMIUM;
            long worksCount = countByArtistId(artist.getId());
            if (!isPremium && worksCount >= 7) {
                throw new AccessDeniedException("Has alcanzado el límite de 7 obras. Hazte premium para subir más.");
            }
        
            worksDone.setArtist(artist);

            return worksDoneRepository.save(worksDone);
        } catch (Exception e) {
            throw e;
        }
    }

    public List<WorksDone> getAllWorksDone() {
        return worksDoneRepository.findAll();
    }

    @Transactional
    public WorksDone updateWorksDone(WorksDone worksDone, Long worksDoneId, Long artistId) throws Exception{
        Artist artist = artistService.findArtist(artistId);

        WorksDone worksDoneToUpdate = worksDoneRepository.findById(worksDoneId)
                .orElseThrow(() -> new ResourceNotFoundException("WorksDone", "id", worksDoneId));

        if (!worksDoneToUpdate.getArtist().getId().equals(artist.getId())) {
            throw new IllegalArgumentException("El artista no tiene permisos para modificar este trabajo.");
        }

        BeanUtils.copyProperties(worksDone, worksDoneToUpdate, "id", "artist");

        return worksDoneRepository.save(worksDoneToUpdate);
    }

    public WorksDone getWorksDoneById(Long id) {
        return worksDoneRepository.findById(id).orElse(null);
    }

    public List<WorksDone> getWorksDoneByArtist(Artist artist) {
        return worksDoneRepository.findAll()
                .stream()
                .filter(work -> work.getArtist().equals(artist))
                .collect(Collectors.toList());
    }

    public List<Artist> getMostPublicationsArtists() {
        return worksDoneRepository.findTop3ArtistsByWorksDone();
    }
    public Long countByArtistId(Long artistId) {
        return worksDoneRepository.countByArtistId(artistId);
    }

}
