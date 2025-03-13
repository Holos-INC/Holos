package com.HolosINC.Holos.model;

import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.HolosINC.Holos.auth.payload.request.LoginRequest;
import com.HolosINC.Holos.auth.payload.response.JwtResponse;
import com.HolosINC.Holos.configuration.jwt.JwtUtils;
import com.HolosINC.Holos.configuration.service.UserDetailsImpl;

import io.swagger.v3.oas.annotations.tags.Tag;


@RestController
@RequestMapping("/api/v1/baseUser")
@Tag(name = "Base User Controller", description = "The API for all users")
public class BaseUserController {

	private final AuthenticationManager authenticationManager;
	private final BaseUserService baseUserService;
	private final JwtUtils jwtUtils;
	// private final BaseUserService baseUserService;

	@Autowired
	public BaseUserController(AuthenticationManager authenticationManager, JwtUtils jwtUtils, BaseUserService baseUserService) {
		this.baseUserService = baseUserService;
		this.authenticationManager = authenticationManager;
		this.jwtUtils = jwtUtils;
	}

	@GetMapping("/userType/{userId}")
    public ResponseEntity<String> getUserType(@PathVariable Long userId) {
        String userType = baseUserService.getUserType(userId);
        return ResponseEntity.ok(userType);
    }
}