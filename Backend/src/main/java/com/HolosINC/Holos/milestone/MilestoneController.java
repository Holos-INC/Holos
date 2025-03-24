package com.HolosINC.Holos.milestone;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;


@RestController
@RequestMapping("/api/v1/milestones")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Milestone Controller", description = "The API for all milestones")
public class MilestoneController {
    
    MilestoneService milestoneService;

    @Autowired
    public MilestoneController(MilestoneService milestoneService) {
        this.milestoneService = milestoneService;
    }

    @PostMapping("/milestone")
    public ResponseEntity<Milestone> saveMilestone(@RequestBody Milestone milestone) {
        return ResponseEntity.ok(milestoneService.save(milestone));
    }

    @GetMapping("/milestone/{id}")
    public ResponseEntity<Milestone> getMilestoneById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(milestoneService.getById(id));
    }

    @GetMapping("/milestones/commision/{commision_id}")
    public ResponseEntity<List<Milestone>> getMilestonesByCommisionId(@PathVariable("commision_id") Long commision_id) {
        return ResponseEntity.ok(milestoneService.getByCommisionId(commision_id));
    }

    @DeleteMapping("/milestone/{id}")
    public ResponseEntity<Milestone> deleteMilestone(@PathVariable("id") Long id) {
        return ResponseEntity.ok(milestoneService.delete(id));
    }
}
