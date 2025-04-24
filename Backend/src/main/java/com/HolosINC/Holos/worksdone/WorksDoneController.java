package com.HolosINC.Holos.worksdone;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.artist.ArtistService;
import com.HolosINC.Holos.auth.Auth;
import com.HolosINC.Holos.auth.payload.response.MessageResponse;
import com.HolosINC.Holos.model.BaseUserService;
import com.HolosINC.Holos.util.RestPreconditions;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

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
            @RequestPart("image") MultipartFile imageFile) {
        try{
            ObjectMapper mapper = new ObjectMapper();
            WorksDoneDTO dto = mapper.readValue(workJson, WorksDoneDTO.class);
    
            if (imageFile != null && !imageFile.isEmpty()) {
                dto.setImage(imageFile.getBytes());
            }
    
            WorksDone work = dto.createWorksDone();
    
            WorksDone created = worksDoneService.createWorksDone(work);
            return ResponseEntity.ok(WorksDoneDTO.createDTO(created));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @GetMapping
    public ResponseEntity<List<WorksDoneDTO>> getAllWorksDone() {
        try {
            List<WorksDoneDTO> worksDoneDTOs = worksDoneService.getAllWorksDone()
                    .stream()
                    .map(work -> WorksDoneDTO.builder()
                            .id(work.getId())
                            .name(work.getName())
                            .description(work.getDescription())
                            .price(work.getPrice())
                            .image(work.getImage())
                            .artistId(work.getArtist().getId())
                            .baseUserId(work.getArtist().getBaseUser().getId())
                            .artistName(work.getArtist().getBaseUser().getName())
                            .artistSurname(work.getArtist().getBaseUser().getUsername())
                            .build())
                    .toList();
            return ResponseEntity.ok(worksDoneDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorksDoneDTO> getWorksDoneById(@PathVariable Long id) {
        try {
            WorksDone worksDone = worksDoneService.getWorksDoneById(id);
            WorksDoneDTO workDoneDTO = WorksDoneDTO.builder()
                    .id(worksDone.getId())
                    .name(worksDone.getName())
                    .description(worksDone.getDescription())
                    .price(worksDone.getPrice())
                    .image(worksDone.getImage())
                    .artistId(worksDone.getArtist().getId())
                    .baseUserId(worksDone.getArtist().getBaseUser().getId())
                    .artistName(worksDone.getArtist().getBaseUser().getName())
                    .artistSurname(worksDone.getArtist().getBaseUser().getUsername())
                    .build();
            return worksDone != null ? ResponseEntity.ok(workDoneDTO) : ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/artist/{username}")
    public ResponseEntity<List<WorksDoneDTO>> getWorksDoneByArtist(@PathVariable String username) {
        try {
            Artist artist = artistService.findArtistByUsername(username);
            List<WorksDoneDTO> worksDoneDTOs = worksDoneService.getWorksDoneByArtist(artist).stream()
                    .map(work -> WorksDoneDTO.builder()
                            .id(work.getId())
                            .name(work.getName())
                            .description(work.getDescription())
                            .price(work.getPrice())
                            .image(work.getImage())
                            .artistId(work.getArtist().getId())
                            .baseUserId(work.getArtist().getBaseUser().getId())
                            .artistName(work.getArtist().getBaseUser().getName())
                            .artistSurname(work.getArtist().getBaseUser().getUsername())
                            .build())
                    .toList();
            return ResponseEntity.ok(worksDoneDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping(value = "/artist/{artistId}/{worksDoneId}")
    public ResponseEntity<WorksDone> updateWorksDone(@PathVariable("worksDoneId") Long worksDoneId, 
        @PathVariable("artistId") Long artistId,
            @RequestBody @Valid WorksDone worksDone) {

        try{
            RestPreconditions.checkNotNull(worksDoneService.getWorksDoneById(worksDoneId), "WorksDone", "ID", worksDoneId);
            return new ResponseEntity<>(worksDoneService.updateWorksDone(worksDone, worksDoneId, artistId), HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @GetMapping("/mostPublicationsArtists")
    public ResponseEntity<List<Artist>> getMostPublicationsArtists() {
        try {
            List<Artist> artists = worksDoneService.getMostPublicationsArtists();
            return ResponseEntity.ok(artists);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/artist/id/{artistId}")
    public ResponseEntity<?> getWorksDoneByArtistId(@PathVariable Long artistId) {
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

        boolean isPremium = artist.getBaseUser().getAuthority() == Auth.ARTIST_PREMIUM;
        long worksCount = worksDoneService.countByArtistId(artist.getId());
        
        boolean canUpload = isPremium || worksCount < 7;
        return ResponseEntity.ok(canUpload);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWorksDone(@PathVariable Long id) {
        try {
            worksDoneService.deleteWorksDone(id);
            return ResponseEntity.ok(new MessageResponse("Trabajo borrado correctamente."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
}
}