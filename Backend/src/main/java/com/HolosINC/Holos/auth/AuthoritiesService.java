package com.HolosINC.Holos.auth;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

import java.time.Instant;
import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.artist.ArtistService;
import com.HolosINC.Holos.auth.payload.request.SignupRequest;
import com.HolosINC.Holos.auth.payload.request.UpdateRequest;
import com.HolosINC.Holos.client.Client;
import com.HolosINC.Holos.client.ClientService;
import com.HolosINC.Holos.exceptions.AccessDeniedException;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserService;
import com.HolosINC.Holos.util.ImageHandler;

@Service
public class AuthoritiesService {

	private final PasswordEncoder encoder;
	private final BaseUserService baseUserService;
	private final ArtistService artistService;
	private final ClientService clientService;
	private final AuthoritiesRepository authoritiesRepository;

	@Autowired
	private ImageHandler imageHandler;

	@Autowired
	public AuthoritiesService(PasswordEncoder encoder, BaseUserService baseUserService, ArtistService artistService,
			ClientService clientService, AuthoritiesRepository authoritiesRepository) {
		this.encoder = encoder;
		this.baseUserService = baseUserService;
		this.artistService = artistService;
		this.clientService = clientService;
		this.authoritiesRepository = authoritiesRepository;
	}

	@Transactional
	public Authorities findByAuthority(String authority) {
		Optional<Authorities> authorities = authoritiesRepository.findByName(authority);
		if (!authorities.isPresent()) {
			throw new ResourceNotFoundException("Este rol no existe");
		}
		return authorities.get();
	}

	@Transactional
	public void createUser(@Valid SignupRequest request) throws Exception {

		try {
			if(authoritiesRepository.existsBaseUserByUsername(request.getUsername()))
				throw new IllegalArgumentException("Nombre de usuario ya existente en la base de datos.");
			if(authoritiesRepository.existsBaseUserByUsername(request.getEmail()))
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
			Authorities role = findByAuthority(strRoles);
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
				artist.setNumSlotsOfWork(request.getNumSlotsOfWork());
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
		} catch (Exception e) {
			throw e;
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

		baseUserService.save(user);

		if (user.getAuthority().getAuthority().toUpperCase().equals("ARTIST ") ||user.getAuthority().getAuthority().toUpperCase().equals("ARTIST_PREMIUM")) {
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
		} else if (user.getAuthority().getAuthority().equals("ADMIN")) {
			throw new AccessDeniedException("No puedes eliminar un usuario administrador");
		}
		if (user.getAuthority().getAuthority().equals("ARTIST") || user.getAuthority().getAuthority().equals("ARTIST_PREMIUM")) {
			Artist artist = artistService.findArtist(id);
			artistService.deleteArtist(artist.getId());
		} else if (user.getAuthority().getAuthority().equals("CLIENT")) {
			Client client = clientService.findClientByUserId(id);
			clientService.deleteClient(client.getId());
		}
		baseUserService.delete(id);
	}
}
