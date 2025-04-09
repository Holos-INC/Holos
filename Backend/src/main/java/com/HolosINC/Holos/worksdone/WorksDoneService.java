package com.HolosINC.Holos.worksdone;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.artist.ArtistService;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorksDoneService {

    private final WorksDoneRepository worksDoneRepository;
    private final ArtistService artistService;

    public WorksDoneService(WorksDoneRepository worksDoneRepository, ArtistService artistService) {
        this.worksDoneRepository = worksDoneRepository;
        this.artistService = artistService;
    }

    public WorksDone createWorksDone(WorksDone worksDone) {
        return worksDoneRepository.save(worksDone);
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

    public Long countByArtistId(Long artistId) {
        return worksDoneRepository.countByArtistId(artistId);
    }

}
