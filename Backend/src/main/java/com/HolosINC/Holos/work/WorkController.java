package com.HolosINC.Holos.work;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/works")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Work Controller", description = "API for managing Works")
public class WorkController {

    private final WorkService workService;

    public WorkController(WorkService workService) {
        this.workService = workService;
    }

    @Operation(
        summary = "Get work by ID",
        description = "Fetches a specific work by its ID.",
        responses = {
            @ApiResponse(
                responseCode = "200", 
                description = "Work found successfully", 
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Work.class))
            ),
            @ApiResponse(responseCode = "404", description = "Work not found", content = @Content)
        }
    )
    @GetMapping("/{id}")
    public ResponseEntity<Work> getWorkById(@PathVariable @Parameter(description = "ID of the work to retrieve") Long id) throws Exception {
        Work work = workService.getWorkById(id);
        return work != null ? ResponseEntity.ok(work) : ResponseEntity.notFound().build();
    }
    
    @Operation(
        summary = "Delete work by ID",
        description = "Deletes a specific work by its ID.",
        responses = {
            @ApiResponse(responseCode = "204", description = "Work deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Work not found", content = @Content)
        }
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkById(@PathVariable @Parameter(description = "ID of the work to delete") Long id) throws Exception {
        try{
            workService.deleteWork(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

}
