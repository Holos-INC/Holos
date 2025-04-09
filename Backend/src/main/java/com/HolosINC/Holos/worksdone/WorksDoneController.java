package com.HolosINC.Holos.worksdone;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.artist.ArtistService;
import com.HolosINC.Holos.auth.payload.response.MessageResponse;
import com.HolosINC.Holos.model.BaseUserService;
import com.HolosINC.Holos.util.RestPreconditions;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/worksdone")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "WorksDone Controller", description = "API for managing WorksDone")
public class WorksDoneController {

    private final WorksDoneService worksDoneService;
    private final ArtistService artistService;
    private final BaseUserService baseUserService;

    @Autowired
    public WorksDoneController(WorksDoneService worksDoneService,
            ArtistService artistService,
            BaseUserService baseUserService) {
        this.worksDoneService = worksDoneService;
        this.artistService = artistService;
        this.baseUserService = baseUserService;
    }

    @PostMapping(consumes = { "multipart/form-data" })
    public ResponseEntity<?> createWorksDone(
            @RequestPart("work") String workJson,
            @RequestPart("image") MultipartFile imageFile) throws IOException {

        ObjectMapper mapper = new ObjectMapper();
        WorksDoneDTO dto = mapper.readValue(workJson, WorksDoneDTO.class);
        dto.setImage(imageFile.getBytes());

        Long currentUserId = baseUserService.findCurrentUser().getId();
        Artist artist = baseUserService.findArtist(currentUserId);

        boolean isPremium = artist.getBaseUser().hasAuthority("ARTIST_PREMIUM");
        long worksCount = worksDoneService.countByArtistId(artist.getId());

        if (!isPremium && worksCount >= 7) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("Has alcanzado el límite de 7 obras. Hazte premium para subir más.");
        }

        WorksDone work = dto.createWorksDone();
        work.setArtist(artist);

        WorksDone created = worksDoneService.createWorksDone(work);
        return ResponseEntity.ok(WorksDoneDTO.createDTO(created));
    }

    @GetMapping
    public ResponseEntity<List<WorksDoneDTO>> getAllWorksDone() {
        List<WorksDoneDTO> dtos = worksDoneService
                .getAllWorksDone()
                .stream()
                .map(WorksDoneDTO::createDTO)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorksDone> getWorksDoneById(@PathVariable Long id) {
        WorksDone worksDone = worksDoneService.getWorksDoneById(id);
        return worksDone != null ? ResponseEntity.ok(worksDone) : ResponseEntity.notFound().build();
    }

    @GetMapping("/artist/{artistId}")
    public ResponseEntity<?> getWorksDoneByArtist(@PathVariable Long artistId) {
        try{
            Artist artist = artistService.findArtist(artistId);
            List<WorksDone> works = worksDoneService.getWorksDoneByArtist(artist);
            return ResponseEntity.ok(works);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PutMapping(value = "/artist/{artistId}/{worksDoneId}", consumes = { "multipart/form-data" })
    public ResponseEntity<?> updateWorksDone(
            @PathVariable("artistId") Long artistId,
            @PathVariable("worksDoneId") Long worksDoneId,
            @RequestPart("work") String workJson,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) throws IOException {

        try{
            ObjectMapper mapper = new ObjectMapper();
            WorksDoneDTO dto = mapper.readValue(workJson, WorksDoneDTO.class);
            WorksDone existingWork = worksDoneService.getWorksDoneById(worksDoneId);
            RestPreconditions.checkNotNull(existingWork, "WorksDone", "ID", worksDoneId);
            Long currentUserId = baseUserService.findCurrentUser().getId();
            Artist currentArtist = baseUserService.findArtist(currentUserId);
            if (!existingWork.getArtist().getId().equals(currentArtist.getId())) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
            if (imageFile != null && !imageFile.isEmpty()) {
                dto.setImage(imageFile.getBytes());
            } else {
                dto.setImage(existingWork.getImage());
            }
            WorksDone workToUpdate = dto.createWorksDone();
            workToUpdate.setId(existingWork.getId()); // Mantenemos el mismo ID
            workToUpdate.setArtist(existingWork.getArtist()); // Mantenemos el mismo artista
            WorksDone updated = worksDoneService.updateWorksDone(workToUpdate, worksDoneId, artistId);

            return ResponseEntity.ok(WorksDoneDTO.createDTO(updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/can-upload")
    public ResponseEntity<Boolean> canUserUploadWork() {
        Long currentUserId = baseUserService.findCurrentUser().getId();
        Artist artist = baseUserService.findArtist(currentUserId);

        boolean isPremium = artist.getBaseUser().hasAuthority("ARTIST_PREMIUM");
        long worksCount = worksDoneService.countByArtistId(artist.getId());
        
        boolean canUpload = isPremium || worksCount < 7 || !(worksCount  == 7) ;
        return ResponseEntity.ok(canUpload);

    }

}
