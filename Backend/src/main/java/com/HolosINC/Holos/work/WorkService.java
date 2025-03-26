package com.HolosINC.Holos.work;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.reports.ReportType;

@Service
public class WorkService {

    private final WorkRepository workRepository;

    public WorkService(WorkRepository workRepository) {
        this.workRepository = workRepository;
    }

    public List<Work> getAllWorks() {
        return workRepository.findAll();
    }

    public Work getWorkById(Long id) {
        return workRepository.findById(id).orElse(null);
    }

    public List<Work> getWorksByArtist(Artist artist) {
        return workRepository.findAll().stream().filter(work -> work.getArtist().equals(artist))
                .collect(Collectors.toList());
    }

    public Work getBaseWorkById(Long id) {
        return workRepository.findBaseWorkById(id).orElse(null);
    }

    @Transactional
    public void deleteWorksByArtistId(Long artistId) {
        List<Work> works = workRepository.findByArtistId(artistId);
        workRepository.deleteAll(works);
    }

    @Transactional(readOnly = true)
    public Optional<Work> findById(Long id) {
        return workRepository.findById(id);
    }

    
}
