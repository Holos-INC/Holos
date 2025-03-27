package com.HolosINC.Holos.client;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
	@GetMapping("/byBaseUser/{baseUserId}")
public ResponseEntity<Client> getClientByBaseUser(@PathVariable Long baseUserId) {
    Client client = clientService.findClientByUserId(baseUserId);
    if(client == null) {
        return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(client);
}



}
