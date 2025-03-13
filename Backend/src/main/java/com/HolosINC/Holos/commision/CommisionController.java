package com.HolosINC.Holos.commision;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.HolosINC.Holos.commision.DTOs.CommisionDTO;
import com.HolosINC.Holos.exceptions.AccessDeniedException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/commisions")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Commision Controller", description = "API for managing Commisions")
public class CommisionController {

    private final CommisionService commisionService;
    private final BaseUserService baseUserService;

    @Autowired
    public CommisionController(CommisionService commisionService, BaseUserService baseUserService) {
        this.commisionService = commisionService;
        this.baseUserService = baseUserService;
    }
    @GetMapping
    public ResponseEntity<List<Commision>> getAllCommisions() {
        List<Commision> commisions = commisionService.getAllCommisions();
        return ResponseEntity.ok(commisions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Commision> getCommisionById(@PathVariable Long id) {
        Commision commision = commisionService.getCommisionById(id);
        return commision != null ? ResponseEntity.ok(commision) : ResponseEntity.notFound().build();
    }

    // @GetMapping("/kanban/{kanbanOrderId}")
    // public ResponseEntity<Collection<Commision>> getCommissionsByKanbanOrderId(@PathVariable Long kanbanOrderId) {
    //     Collection<Commision> commissions = commisionService.getCommissionsByKanbanOrderId(kanbanOrderId);
    //     if (commissions.isEmpty()) {
    //         return ResponseEntity.noContent().build();
    //     }
    //     return ResponseEntity.ok(commissions);
    // }

    @GetMapping("/kanban/{artistUsername}")
    public ResponseEntity<List<Commision>> getByArtistId(@PathVariable String artistUsername) {
        BaseUser user = baseUserService.findCurrentUser();

        if (artistUsername != null) {
			if (user.getUsername().equals(artistUsername))
				return new ResponseEntity<>(commisionService.getByArtistUsername(artistUsername), HttpStatus.OK);
		}
		throw new AccessDeniedException();
    }

    @PostMapping("/{artistId}")
    public ResponseEntity<?> createCommision(@Valid @RequestBody CommisionDTO commision, @PathVariable Long artistId) {
        try {
            Commision createdCommision = commisionService.createCommision(commision, artistId);
            return ResponseEntity.ok(createdCommision);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateCommisionStatus(
            @PathVariable Long id,
            @RequestParam Long artistId,
            @RequestParam boolean accept) {
        try {
            Commision updatedCommision = commisionService.updateCommisionStatus(id, artistId, accept);
            return ResponseEntity.ok(updatedCommision);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("⚠ Error interno: " + e.getMessage());
        }
    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<?> cancelCommision(
            @PathVariable Long id,
            @RequestParam Long clientId) {
        try {
            commisionService.cancelCommision(id, clientId);
            return ResponseEntity.ok("Comisión cancelada correctamente.");
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("⚠ Error interno: " + e.getMessage());
        }
    }

    @PutMapping("/next-stage")
    public ResponseEntity<Commision> moveToNextStage(@RequestBody @Valid Commision commission) {
        System.out.println("\nCOMMISSION------------------------\n"+commission);
        System.out.println("\nARTIST----------------------------\n" + commission.getArtist()+"\n");
        return new ResponseEntity<>(commisionService.moveToNextStage(commission), HttpStatus.OK);
    }
}
