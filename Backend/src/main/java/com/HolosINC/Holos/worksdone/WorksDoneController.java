package com.HolosINC.Holos.worksdone;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.artist.ArtistService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/worksdone")
@Tag(name = "WorksDone Controller", description = "API for managing WorksDone")
public class WorksDoneController {

    private final WorksDoneService worksDoneService;
    private final ArtistService artistService;

    @Autowired
    public WorksDoneController(WorksDoneService worksDoneService, ArtistService artistService) {
        this.worksDoneService = worksDoneService;
        this.artistService = artistService;
    }

    @PostMapping
    public ResponseEntity<WorksDone> createWorksDone(@RequestBody WorksDone worksDone) {
        WorksDone createdWork = worksDoneService.createWorksDone(worksDone);
        return ResponseEntity.ok(createdWork);
    }

    @GetMapping
    public ResponseEntity<List<WorksDone>> getAllWorksDone() {
        List<WorksDone> works = worksDoneService.getAllWorksDone();
        return ResponseEntity.ok(works);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorksDone> getWorksDoneById(@PathVariable Long id) {
        WorksDone worksDone = worksDoneService.getWorksDoneById(id);
        return worksDone != null ? ResponseEntity.ok(worksDone) : ResponseEntity.notFound().build();
    }

    @GetMapping("/artist/{artistId}")
    public ResponseEntity<List<WorksDone>> getWorksDoneByArtist(@PathVariable Long artistId) {
        Artist artist = artistService.findArtist(artistId);
        List<WorksDone> works = worksDoneService.getWorksDoneByArtist(artist);
        return ResponseEntity.ok(works);
    }

}
