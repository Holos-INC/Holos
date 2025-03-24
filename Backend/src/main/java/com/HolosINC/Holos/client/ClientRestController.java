package com.HolosINC.Holos.client;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/v1/users")
@SecurityRequirement(name = "bearerAuth")
class ClientRestController {

	private final ClientService clientService;
	private final BaseUserService baseUserService;

	@Autowired
	public ClientRestController(ClientService clientService, BaseUserService baseUserService) {
		this.clientService = clientService;
		this.baseUserService = baseUserService;
	}

	@GetMapping(value = "{id}")
	public ResponseEntity<Client> findById(@PathVariable("id") Long id) {
		return new ResponseEntity<>(clientService.findClient(id), HttpStatus.OK);
	}

	@GetMapping("/administrator/clients")
    public ResponseEntity<List<BaseUser>> getAllClients() {
        return ResponseEntity.ok(baseUserService.getAllUsersByRole("CLIENT"));
    }

	@GetMapping("/administrator/clients/{id}")
    public ResponseEntity<Client> getClientById(@PathVariable Long id) {
        try {
            Client client = clientService.findClient(id);
            return ResponseEntity.ok(client);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(null);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

	@PostMapping("/administrator/clients/{id}")
    public ResponseEntity<?> createClient(@RequestBody Client client) {
        try {
            Client createdClient = clientService.createClient(client);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdClient);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error interno al crear el cliente.");
        }
    }
	
    @PutMapping("/administrator/clients/{id}")
    public ResponseEntity<Client> updateClient(@PathVariable Long id, @RequestBody Client updatedClient) {
        try {
            Client client = clientService.updateClient(id, updatedClient);
            return ResponseEntity.ok(client);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

	@DeleteMapping("/administrator/clients/{id}")
    public ResponseEntity<?> deleteClient(@PathVariable Long id) {
        try {
            clientService.deleteClient(id);
            return ResponseEntity.ok().body("Cliente eliminado exitosamente");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error interno al eliminar el cliente");
        }
    }
	@GetMapping("/profile")
	public ResponseEntity<?> profileOfCurrentUser() {
		try {
			BaseUser user = baseUserService.findCurrentUser();
			Object endUser = null;
			if(user.hasAuthority("CLIENT"))
				endUser = baseUserService.findClient(user.getId());
			if(user.hasAuthority("ARTIST"))
				endUser = baseUserService.findArtist(user.getId());
			return ResponseEntity.ok().body(endUser);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body("No tienes perfil, tienes que loguearte");
		}
	}

}
