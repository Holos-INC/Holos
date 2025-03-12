package com.HolosINC.Holos.milestone;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.HolosINC.Holos.commision.Commision;
import com.HolosINC.Holos.commision.CommisionRepository;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;

@Service
public class MilestoneService {

    private final MilestoneRepository milestoneRepository;
    private final CommisionRepository commisionRepository;

    @Autowired
    public MilestoneService(MilestoneRepository milestoneRepository, CommisionRepository commisionRepository) {
        this.milestoneRepository = milestoneRepository;
        this.commisionRepository = commisionRepository;
    }

    public List<Milestone> getByCommisionId(Long id) {
        Commision comission = commisionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Commission", "id", id));
        return milestoneRepository.getByCommisionId(id);
    }

    public Milestone getById(Long id) {
        return milestoneRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Milestone", "id", id));
    }

    public Milestone delete(Long id) {
        Milestone milestone = milestoneRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Milestone", "id", id));
            milestoneRepository.delete(milestone);
        return milestone;
    }

    public Milestone save(Milestone milestone) {
        return milestoneRepository.save(milestone);
    }
}
