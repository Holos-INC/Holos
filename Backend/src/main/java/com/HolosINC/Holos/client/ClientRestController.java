package com.HolosINC.Holos.Client;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserDTO;
import com.HolosINC.Holos.model.BaseUserService;
import com.Profile.ProfileService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/v1/users")
@SecurityRequirement(name = "bearerAuth")
class ClientRestController {

	private final ClientService clientService;
	private final BaseUserService baseUserService;

	@Autowired
    private ProfileService profileService;

    @PutMapping("/update")
    public ResponseEntity<BaseUserDTO> updateProfile(@RequestBody BaseUserDTO baseUserDTO) {
        // Llamamos al servicio para actualizar el perfil y usamos findCurrentUser() para obtener el id
        BaseUserDTO updatedUserDTO = profileService.updateProfile(baseUserDTO);
        
        // Devolvemos el resultado de la actualización, que será el mismo DTO con los datos actualizados
        return ResponseEntity.ok(updatedUserDTO);
    }
	
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

}
