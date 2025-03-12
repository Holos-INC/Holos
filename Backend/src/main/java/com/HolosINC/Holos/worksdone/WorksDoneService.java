package com.HolosINC.Holos.worksdone;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.artist.ArtistService;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserService;

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

    public WorksDone createWorksDone(WorksDone worksDone) {
        BaseUser authenticatedUser = baseUserService.findCurrentUser();
        Artist authenticatedArtist = artistService.findArtist(authenticatedUser.getId());

        if(worksDone==null) {
            throw new IllegalArgumentException("El objeto WorksDone no puede ser nulo.");
        }

        if (authenticatedArtist == null || authenticatedArtist.getId() == null) {
            throw new IllegalArgumentException("El trabajo debe estar asociado a un artista válido.");
        }

        worksDone.setArtist(authenticatedArtist);
        return worksDoneRepository.save(worksDone);
    }

    public List<WorksDone> getAllWorksDone() {
        return worksDoneRepository.findAll();
    }

    @Transactional
    public WorksDone updateWorksDone(WorksDone worksDone, Long worksDoneId, Long artistId) {
        if(worksDone==null) {
            throw new IllegalArgumentException("El objeto WorksDone no puede ser nulo.");
        }
        
        Artist artist = artistService.findArtist(artistId);
        if (artist == null) {
            throw new ResourceNotFoundException("Artist","id", artistId);
        }

        WorksDone worksDoneToUpdate = worksDoneRepository.findById(worksDoneId)
            .orElseThrow(() -> new ResourceNotFoundException("WorksDone", "id", worksDoneId));

        if (!worksDoneToUpdate.getArtist().getId().equals(artist.getId())) {
            throw new IllegalArgumentException("El artista no tiene permisos para modificar este trabajo.");
        }

        BeanUtils.copyProperties(worksDone, worksDoneToUpdate, "id");
        return worksDoneRepository.save(worksDoneToUpdate);
    }

    public WorksDone getWorksDoneById(Long id) {
        return worksDoneRepository.findById(id).orElse(null);
    }

    public List<WorksDone> getWorksDoneByArtist(Artist artist) {
        return worksDoneRepository.findAll().stream().filter(work -> work.getArtist().equals(artist))
                .collect(Collectors.toList());
    }

}
