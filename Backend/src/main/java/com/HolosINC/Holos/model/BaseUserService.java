package com.HolosINC.Holos.model;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.auth.Auth;
import com.HolosINC.Holos.client.Client;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;


@Service
public class BaseUserService {
    private BaseUserRepository baseUserRepository;

	@Autowired
	public BaseUserService(BaseUserRepository baseUserRepository) {
		this.baseUserRepository = baseUserRepository;
	}

    public BaseUser save(BaseUser baseUser) {
        return baseUserRepository.save(baseUser);
    }

    public BaseUser login(String username, String password) {
        Optional<BaseUser> user = baseUserRepository.login(username, password);
        if (user.isEmpty()) {
            throw new BadCredentialsException("Invalid username or password");
        }
        return user.get();
    }

    public Boolean existsUser(String username) {
        return baseUserRepository.findUserByUsername(username).isPresent();
    }

    public Boolean existsEmail(String email) {
        return baseUserRepository.findByEmail(email).isPresent();
    }

    public BaseUser findById(Long id) {
        return baseUserRepository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    public BaseUser findCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null)
            throw new ResourceNotFoundException("No estás logeado");

        return baseUserRepository.findUserByUsername(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", auth.getName()));
    }
    
    @Transactional
    public BaseUser delete(Long id) {
        BaseUser user = baseUserRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        baseUserRepository.delete(user);
        return user;
    }

    public Client findClient(Long id) {
        return baseUserRepository.findClient(id)
                .orElseThrow(() -> new ResourceNotFoundException("No hay cliente para este id"));
    }

    public Artist findArtist(Long id) {
        return baseUserRepository.findArtist(id)
                .orElseThrow(() -> new ResourceNotFoundException("No hay cliente para este id"));
    }

    @Transactional(readOnly = true)
    public List<BaseUser> getAllUsers() {
        return baseUserRepository.findAll();
    }

    @Transactional(readOnly = true)
    public BaseUser getUserById(Long id) {
        return baseUserRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    @Transactional
    public BaseUser updateUserAdmins(Long id, BaseUser updatedUser) {
        return baseUserRepository.findById(id).map(user -> {
            user.setName(updatedUser.getName());
            user.setUsername(updatedUser.getUsername());
            user.setEmail(updatedUser.getEmail());
            user.setPhoneNumber(updatedUser.getPhoneNumber());
            return baseUserRepository.save(user);
        }).orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }
    
    @Transactional
    public BaseUser changeUserRole(Long id, String newRole) throws Exception{
        BaseUser user = baseUserRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        Auth authority = Auth.valueOf(newRole.toUpperCase());

        if(authority == null) {
            throw new IllegalArgumentException("Invalid role: " + newRole);
        }

        user.setAuthority(authority);
        return baseUserRepository.save(user);
    }
}