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
	public void createUser(@Valid SignupRequest request) {

		BaseUser user = new BaseUser();
		user.setUsername(request.getUsername());
		user.setName(request.getFirstName());
		user.setCreatedUser(Date.from(Instant.now()));
		user.setPassword(encoder.encode(request.getPassword()));
		user.setEmail(request.getEmail());
		user.setPhoneNumber(request.getPhoneNumber());
		user.setImageProfile(imageHandler.getBytes(request.getImageProfile()));
		String strRoles = request.getAuthority().toUpperCase();
		Authorities role = findByAuthority(strRoles);
		user.setAuthority(role);

		if (strRoles == "ARTIST") {
			baseUserService.save(user);
			Artist artist = new Artist();
			artist.setBaseUser(user);
			artistService.saveArtist(artist);
		} else if (strRoles == "CLIENT") {
			Client client = new Client();
			baseUserService.save(user);
			client.setBaseUser(user);
			clientService.saveClient(client);
		} else {
			baseUserService.save(user);
		}
	}

	@Transactional
	public void updateUser(@Valid SignupRequest request) {
		BaseUser user = baseUserService.findCurrentUser();
		user.setUsername(request.getUsername());
		user.setName(request.getFirstName());
		user.setUpdatedUser(Date.from(Instant.now()));
		user.setPassword(encoder.encode(request.getPassword()));
		user.setEmail(request.getEmail());
		user.setPhoneNumber(request.getPhoneNumber());
		user.setImageProfile(imageHandler.getBytes(request.getImageProfile()));

		if (request.getAuthority().toUpperCase() == "ARTIST") {
			Artist artist = artistService.findArtist(user.getId());
			artist.setBaseUser(user);
			artistService.saveArtist(artist);
		} else if (request.getAuthority().toUpperCase() == "CLIENT") {
			Client client = clientService.findClient(user.getId());
			client.setBaseUser(user);
		} else {
			baseUserService.save(user);
		}
	}

	@Transactional
	public void deleteUser(Long id) {
		BaseUser user = baseUserService.findCurrentUser();
		if (user.getId() != id) {
			throw new AccessDeniedException("No puedes eliminar un usuario que no eres tu");
		} else if (user.getAuthority().getAuthority().equals("ADMIN")) {
			throw new AccessDeniedException("No puedes eliminar un usuario administrador");
		}
		if (user.getAuthority().getAuthority().equals("ARTIST")) {
			Artist artist = artistService.findArtist(id);
			artistService.deleteArtist(artist.getId());
		} else if (user.getAuthority().getAuthority().equals("CLIENT")) {
			Client client = clientService.findClientByUserId(id);
			clientService.deleteClient(client.getId());
		}
		baseUserService.delete(id);
	}
}
