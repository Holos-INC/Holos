package com.HolosINC.Holos.auth;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

import java.time.Instant;
import java.util.Date;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.artist.ArtistService;
import com.HolosINC.Holos.auth.payload.request.SignupRequest;
import com.HolosINC.Holos.auth.payload.request.UpdateRequest;
import com.HolosINC.Holos.client.Client;
import com.HolosINC.Holos.client.ClientService;
import com.HolosINC.Holos.exceptions.AccessDeniedException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserService;
import com.HolosINC.Holos.util.ImageHandler;

@Service
public class AuthoritiesService {

	private final PasswordEncoder encoder;
	private final BaseUserService baseUserService;
	private final ArtistService artistService;
	private final ClientService clientService;
	private final ImageHandler imageHandler;

	public AuthoritiesService(PasswordEncoder encoder, BaseUserService baseUserService, ArtistService artistService, ClientService clientService, ImageHandler imageHandler) {
		this.imageHandler = imageHandler;
		this.encoder = encoder;
		this.baseUserService = baseUserService;
		this.artistService = artistService;
		this.clientService = clientService;
	}

	@Transactional
	public void createUser(@Valid SignupRequest request) throws Exception {
		if (baseUserService.existsUser(request.getUsername()))
			throw new IllegalArgumentException("Nombre de usuario ya existente en la base de datos.");
		if(baseUserService.existsEmail(request.getEmail()))
			throw new IllegalArgumentException("Email ya existente en la base de datos.");

		if (request.getImageProfile().getSize() > 5 * 1024 * 1024) 
			throw new IllegalArgumentException("La imagen de perfil no puede ser mayor a 5MB.");
		
		BaseUser user = new BaseUser();
		user.setUsername(request.getUsername());
		user.setName(request.getFirstName());
		user.setCreatedUser(Date.from(Instant.now()));
		user.setPassword(encoder.encode(request.getPassword()));
		user.setEmail(request.getEmail());
		user.setPhoneNumber(request.getPhoneNumber());
		user.setImageProfile(imageHandler.getBytes(request.getImageProfile()));
	
		if (request.getImageProfile() != null) {
			user.setImageProfile(imageHandler.getBytes(request.getImageProfile()));
		}
	
		String strRoles = request.getAuthority().toUpperCase();
		Auth role = Auth.valueOf(strRoles);

		if (role == null) {
			throw new IllegalArgumentException("Rol no válido: " + strRoles);
		}
		
		user.setAuthority(role);

		if (strRoles.equals("ARTIST")) {
			baseUserService.save(user);

			Artist artist = new Artist();
		if (request.getTableCommisionsPrice() != null) {
			if(request.getTableCommisionsPrice().getSize() > 0) {
				artist.setTableCommisionsPrice(imageHandler.getBytes(request.getTableCommisionsPrice()));
			} else {
				throw new IllegalArgumentException("No se ha subido la tabla de comisiones.");
			}
		}

			artist.setLinkToSocialMedia(request.getLinkToSocialMedia());
			artist.setNumSlotsOfWork(7);
			artist.setTableCommisionsPrice(request.getTableCommisionsPrice().getBytes());
			artist.setBaseUser(user);
	
			artistService.saveArtist(artist);
		} else if (strRoles.equals("CLIENT")) {
			Client client = new Client();
			baseUserService.save(user);
			client.setBaseUser(user);
			clientService.saveClient(client);
		} else {
			baseUserService.save(user);
		}
	}

	@Transactional
	public void updateUser(@Valid UpdateRequest request) throws Exception{
		BaseUser user = baseUserService.findCurrentUser();
		user.setUsername(request.getUsername() != null ? request.getUsername() : user.getUsername());
		user.setName(request.getFirstName() != null ? request.getFirstName() : user.getName());
		user.setUpdatedUser(Date.from(Instant.now()));
		user.setEmail(request.getEmail() != null ? request.getEmail() : user.getEmail());
		user.setPhoneNumber(request.getPhoneNumber() != null ? request.getPhoneNumber() : user.getPhoneNumber());
		user.setImageProfile(request.getImageProfile() != null ? imageHandler.getBytes(request.getImageProfile()) : user.getImageProfile());
		user.setDescription(request.getDescription() != null ? request.getDescription() : user.getDescription());

		baseUserService.save(user);

		if (user.getAuthority() == Auth.ARTIST ||
			user.getAuthority() == Auth.ARTIST_PREMIUM) {
			Artist artist = artistService.findArtist(user.getId());
			artist.setLinkToSocialMedia(request.getLinkToSocialMedia() != null ? request.getLinkToSocialMedia()
					: artist.getLinkToSocialMedia());
			artist.setTableCommisionsPrice(
					request.getTableCommissionsPrice() != null ? request.getTableCommissionsPrice().getBytes()
							: artist.getTableCommisionsPrice());
			artistService.saveArtist(artist);
		}
	}

	@Transactional
	public void deleteUser(Long id) throws Exception{
		BaseUser user = baseUserService.findCurrentUser();
		if (user.getId() != id) {
			throw new AccessDeniedException("No puedes eliminar un usuario que no eres tu");
		} else if (user.getAuthority() == Auth.ADMIN) {
			throw new AccessDeniedException("No puedes eliminar un usuario administrador");
		}
		if (user.getAuthority() == Auth.ARTIST ||
			user.getAuthority() == Auth.ARTIST_PREMIUM) {
			Artist artist = artistService.findArtist(id);
			artistService.deleteArtist(artist.getId());
		} else if (user.getAuthority() == Auth.CLIENT) {
			Client client = clientService.findClientByUserId(id);
			clientService.deleteClient(client.getId());
		}
		baseUserService.delete(id);
	}
}
