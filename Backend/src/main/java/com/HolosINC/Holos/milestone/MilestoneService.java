package com.HolosINC.Holos.milestone;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MilestoneService {

    private final MilestoneRepository milestoneRepository;

    @Autowired
    public MilestoneService(MilestoneRepository milestoneRepository) {
        this.milestoneRepository = milestoneRepository;
    }

    public List<Milestone> getByCommisionId(Long id) {
        return milestoneRepository.getByCommisionId(id);
    }

    public Milestone getById(Long id) {
        return milestoneRepository.findById(id).orElse(null);
    }

    public Milestone delete(Long id) {
        Milestone milestone = milestoneRepository.findById(id).orElse(null);
        if (milestone != null) {
            milestoneRepository.delete(milestone);
        }
        return milestone;
    }

    public Milestone save(Milestone milestone) {
        return milestoneRepository.save(milestone);
    }
}
