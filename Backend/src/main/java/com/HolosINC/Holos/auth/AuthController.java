package com.HolosINC.Holos.auth;

import java.util.List;
import java.util.stream.Collectors;

import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.HolosINC.Holos.auth.payload.request.LoginRequest;
import com.HolosINC.Holos.auth.payload.request.SignupRequest;
import com.HolosINC.Holos.auth.payload.response.JwtResponse;
import com.HolosINC.Holos.auth.payload.response.MessageResponse;
import com.HolosINC.Holos.configuration.jwt.JwtUtils;
import com.HolosINC.Holos.configuration.service.UserDetailsImpl;
import com.HolosINC.Holos.model.BaseUserService;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.security.authentication.BadCredentialsException;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "The Authentication API based on JWT")
public class AuthController {

	private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

	private final AuthenticationManager authenticationManager;
	private final BaseUserService baseUserService;
	private final JwtUtils jwtUtils;
	private final AuthoritiesService authService;
	@SuppressWarnings("unused")
	private final PasswordEncoder encoder;

	@Autowired
	public AuthController(AuthenticationManager authenticationManager, BaseUserService baseUserService,
			JwtUtils jwtUtils, PasswordEncoder encoder,
			AuthoritiesService authService) {
		this.baseUserService = baseUserService;
		this.jwtUtils = jwtUtils;
		this.authenticationManager = authenticationManager;
		this.authService = authService;
		this.encoder = encoder;
	}

	@PostMapping("/signin")
	public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
		try {
			Authentication authentication = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

			SecurityContextHolder.getContext().setAuthentication(authentication);
			String jwt = jwtUtils.generateJwtToken(authentication);

			UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
			List<String> roles = userDetails.getAuthorities().stream().map(item -> item.getAuthority())
					.collect(Collectors.toList());

			return ResponseEntity.ok()
					.body(new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(), roles));
		} catch (BadCredentialsException exception) {
			logger.error("Bad credentials for user: {}", loginRequest.getUsername(), exception);
			return ResponseEntity.badRequest().body("Bad Credentials!");
		} catch (Exception exception) {
			logger.error("Authentication failed for user: {}", loginRequest.getUsername(), exception);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Authentication failed!");
		}
	}

	@GetMapping("/validate")
	public ResponseEntity<Boolean> validateToken(@RequestParam String token) {
		Boolean isValid = jwtUtils.validateJwtToken(token);
		return ResponseEntity.ok(isValid);
	}

	@PostMapping(value = "/signup", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<MessageResponse> registerUser(
			@RequestPart("user") String signupRequestJson,
			@RequestPart(value = "imageProfile", required = false) MultipartFile imageProfile) {

		try {
			// Convertir el JSON plano a objeto Java
			ObjectMapper objectMapper = new ObjectMapper();
			SignupRequest signupRequest = objectMapper.readValue(signupRequestJson, SignupRequest.class);

			// Asignar la imagen al DTO (si se ha enviado)
			signupRequest.setImageProfile(imageProfile);

			// Validar si ya existe el usuario
			if (baseUserService.existsUser(signupRequest.getUsername())) {
				return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
			}

			// Registrar usuario
			authService.createUser(signupRequest);
			return ResponseEntity.ok(new MessageResponse("User registered successfully!"));

		} catch (Exception e) {
			e.printStackTrace(); // Para ver el error en consola
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(new MessageResponse("Error during registration: " + e.getMessage()));
		}
	}

	@PutMapping("/update")
	public ResponseEntity<MessageResponse> updateUser(@Valid @RequestBody SignupRequest signUpRequest) {
		if (baseUserService.existsUser(signUpRequest.getUsername()).equals(false)) {
			return ResponseEntity.badRequest().body(new MessageResponse("Error: Username does not exist!"));
		}
		authService.updateUser(signUpRequest);
		return ResponseEntity.ok(new MessageResponse("User updated successfully!"));
	}

	@DeleteMapping("/delete/{id}")
	public ResponseEntity<MessageResponse> deleteUser(@RequestParam Long id) {
		authService.deleteUser(id);
		return ResponseEntity.ok(new MessageResponse("User deleted successfully!"));
	}

}
