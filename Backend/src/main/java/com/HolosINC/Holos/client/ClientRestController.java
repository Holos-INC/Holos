package com.HolosINC.Holos.client;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.HolosINC.Holos.Profile.ProfileService;
import com.HolosINC.Holos.auth.payload.response.MessageResponse;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserDTO;
import com.HolosINC.Holos.model.BaseUserService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/users")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Client", description = "The Client API for managing client-related operations.")
class ClientRestController {

    private final ClientService clientService;
    private final BaseUserService baseUserService;
    private final ProfileService profileService;

    @Autowired
    public ClientRestController(ClientService clientService, BaseUserService baseUserService, ProfileService profileService) {
        this.clientService = clientService;
        this.baseUserService = baseUserService;
        this.profileService = profileService;
    }

    @Operation(
        summary = "Find a client by ID",
        description = "Retrieve the client information by their ID.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Client found", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Client.class))),
            @ApiResponse(responseCode = "404", description = "Client not found")
        }
    )
    @GetMapping(value = "{id}")
    public ResponseEntity<Client> findById(@PathVariable("id") Long id) {
        return new ResponseEntity<>(clientService.findClient(id), HttpStatus.OK);
    }

    @Operation(
        summary = "Update user profile",
        description = "Updates the profile information of the currently authenticated user.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Profile updated successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = BaseUserDTO.class))),
            @ApiResponse(responseCode = "400", description = "Bad request", content = @Content(mediaType = "application/json"))
        }
    )
    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(@RequestBody BaseUserDTO baseUserDTO){
        try{
            BaseUserDTO updatedUserDTO = profileService.updateProfile(baseUserDTO);
            return ResponseEntity.ok(updatedUserDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @Operation(
        summary = "Get profile of the current user",
        description = "Retrieve the profile of the currently authenticated user, either as a client or artist.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Profile found", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "400", description = "No profile found")
        }
    )
    @GetMapping("/profile")
    public ResponseEntity<?> profileOfCurrentUser() {
        try {
            BaseUser user = baseUserService.findCurrentUser();
            Object endUser = null;
            if(user.hasAuthority("CLIENT"))
                endUser = baseUserService.findClient(user.getId());
            if(user.hasAuthority("ARTIST")||user.hasAuthority("ARTIST_PREMIUM"))
                endUser = baseUserService.findArtist(user.getId());
            return ResponseEntity.ok().body(endUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("No tienes perfil, tienes que loguearte");
        }
    }

    @Operation(
        summary = "Get client by BaseUser ID",
        description = "Retrieve client information based on their associated BaseUser ID.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Client found", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Client.class))),
            @ApiResponse(responseCode = "404", description = "Client not found")
        }
    )
    @GetMapping("/byBaseUser/{baseUserId}")
    public ResponseEntity<Client> getClientByBaseUser(@PathVariable Long baseUserId) {
        Client client = clientService.findClientByUserId(baseUserId);
        if(client == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(client);
    }

    @Operation(
        summary = "Delete a client",
        description = "Deletes a client from the system by their ID.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Client deleted successfully", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "400", description = "Error deleting client", content = @Content(mediaType = "application/json"))
        }
    )
    @DeleteMapping("/administrator/clients/{id}")
    public ResponseEntity<?> deleteClient(@PathVariable Long id) {
        try {
            clientService.deleteClient(id);
            return ResponseEntity.ok().body("Cliente eliminado exitosamente");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (org.hibernate.exception.ConstraintViolationException e) {
            // Captura específicamente el error de violación de restricción de clave foránea
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No se puede eliminar el cliente porque tiene registros relacionados en otras partes del sistema.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error interno al eliminar el cliente: " + e.getMessage());
        }
    }
    //check
}