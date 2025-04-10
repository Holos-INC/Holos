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

@RestController
@RequestMapping("/api/v1/users")
@SecurityRequirement(name = "bearerAuth")
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

	@GetMapping(value = "{id}")
	public ResponseEntity<Client> findById(@PathVariable("id") Long id) {
		return new ResponseEntity<>(clientService.findClient(id), HttpStatus.OK);
	}

    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(@RequestBody BaseUserDTO baseUserDTO){
        try{
            BaseUserDTO updatedUserDTO = profileService.updateProfile(baseUserDTO);
            return ResponseEntity.ok(updatedUserDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

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

	@GetMapping("/byBaseUser/{baseUserId}")
    public ResponseEntity<Client> getClientByBaseUser(@PathVariable Long baseUserId) {
        Client client = clientService.findClientByUserId(baseUserId);
		if(client == null) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(client);
	}



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
}
