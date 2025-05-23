package com.HolosINC.Holos.Profile;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.HolosINC.Holos.model.BaseUserDTO;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@Tag(name = "Profile Controller", description = "API para gestionar el perfil de usuario y convertilo al DTO")
@RestController
@RequestMapping("/profile")
public class ProfileController {

    private ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @PutMapping("/update")
    @Operation(summary = "Actualizar perfil", 
               description = "Permite actualizar los datos del perfil del usuario a un DTO para usa mas facil en Front. El usuario debe estar autenticado, y asi usamos el finduser."
    )
    public ResponseEntity<BaseUserDTO> updateProfile(
            @RequestBody @Valid @Parameter(description = "DTO con los nuevos datos del usuario") BaseUserDTO baseUserDTO) {
        try {
            BaseUserDTO updatedUser = profileService.updateProfile(baseUserDTO);  
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
}
}
