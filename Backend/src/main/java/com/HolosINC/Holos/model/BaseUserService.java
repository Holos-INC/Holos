package com.HolosINC.Holos.model;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;


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

    public BaseUser findById(Long id) {
        return baseUserRepository.findById(id).orElse(null);
    }
}
