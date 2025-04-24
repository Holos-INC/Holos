package com.HolosINC.Holos.work;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;

@Service
public class WorkService {

    private final WorkRepository workRepository;

    public WorkService(WorkRepository workRepository) {
        this.workRepository = workRepository;
    }

    public List<Work> getAllWorks() {
        return workRepository.findAll();
    }

    public Work getWorkById(Long id) throws Exception{
        return workRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Work not found with id: " + id));
    }

    public List<Work> getWorksByArtist(Artist artist) {
        return workRepository.findAll().stream().filter(work -> work.getArtist().equals(artist))
                .collect(Collectors.toList());
    }

    public void deleteWork(Long id) throws Exception{
        Work work = getWorkById(id);
        workRepository.delete(work);
    }
}
