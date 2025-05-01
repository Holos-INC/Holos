package com.HolosINC.Holos.work;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/works")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Work Controller", description = "API for managing Works")
public class WorkController {

    private final WorkService workService;

    public WorkController(WorkService workService) {
        this.workService = workService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Work> getWorkById(@PathVariable Long id) throws Exception {
        Work work = workService.getWorkById(id);
        return work != null ? ResponseEntity.ok(work) : ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkById(@PathVariable Long id) throws Exception {
        try{
            workService.deleteWork(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

}
