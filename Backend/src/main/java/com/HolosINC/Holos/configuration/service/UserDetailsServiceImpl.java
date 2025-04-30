package com.HolosINC.Holos.configuration.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

	private BaseUserRepository userRepository;

	public UserDetailsServiceImpl(BaseUserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	@Transactional
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		BaseUser user = userRepository.findUserByUsername(username)
				.orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));

		return UserDetailsImpl.build(user);
	}

}
