package com.HolosINC.Holos.configuration.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.artist.ArtistRepository;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.exceptions.UserBannedException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
	@Autowired
	BaseUserRepository userRepository;

	@Autowired
	ArtistRepository artistRepository;

	@Override
	@Transactional
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		BaseUser user = userRepository.findUserByUsername(username)
				.orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));

		if (user.hasAuthority("ARTIST")) {
			Artist artist = artistRepository.findArtistByUser(user.getId())
					.orElseThrow(() -> new ResourceNotFoundException("Artist", "baseUser.id", user.getId()));

			if (artist.isBanned()) {
				if (artist.getBannedUntil() != null && artist.getBannedUntil().isBefore(LocalDateTime.now())) {
					artist.setBanned(false);
					artist.setBannedUntil(null);
					artistRepository.save(artist);
				} else {
					throw new UserBannedException("Tu cuenta está temporalmente suspendida hasta " + artist.getBannedUntil());
				}
			}
		}

		return UserDetailsImpl.build(user);
	}
}
