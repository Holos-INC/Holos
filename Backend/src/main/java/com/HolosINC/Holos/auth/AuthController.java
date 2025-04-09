package com.HolosINC.Holos.auth;

import java.util.List;
import java.util.stream.Collectors;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
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
			return ResponseEntity.badRequest().body("Credenciales incorrectas!");
		} catch (Exception exception) {
			return ResponseEntity.badRequest().body("Fallo de autenticacion!");
		}
	}

	@GetMapping("/validate")
	public ResponseEntity<Boolean> validateToken(@RequestParam String token) {
		Boolean isValid = jwtUtils.validateJwtToken(token);
		return ResponseEntity.ok(isValid);
	}

	@PostMapping(value = "/signup", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> registerUser(
			@RequestPart("user") String signupRequestJson,
			@RequestPart(value = "imageProfile", required = false) MultipartFile imageProfile,
			@RequestPart(value = "tableCommissionsPrice", required = false) MultipartFile tableCommissionsPrice) {

		try {
			ObjectMapper objectMapper = new ObjectMapper();
			SignupRequest signupRequest = objectMapper.readValue(signupRequestJson, SignupRequest.class);

			// Validar y asignar la imagen de perfil
			if (imageProfile != null && !imageProfile.isEmpty()) {
				signupRequest.setImageProfile(imageProfile);
			}

			if (tableCommissionsPrice != null && !tableCommissionsPrice.isEmpty()) {
				signupRequest.setTableCommissionsPrice(tableCommissionsPrice);
			}

			// Registrar usuario
			authService.createUser(signupRequest);
			return ResponseEntity.ok(new MessageResponse("Usuario registrado con exito!"));

		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		} catch (Exception e) {
			e.printStackTrace(); // Para ver el error en consola
			return ResponseEntity.badRequest().body(new MessageResponse("Error durante el registro: " + e.getMessage()));
		}
	}

	@PutMapping("/update")
	public ResponseEntity<MessageResponse> updateUser(@Valid @RequestBody SignupRequest signUpRequest) {
		try{
			if (baseUserService.existsUser(signUpRequest.getUsername()).equals(false)) {
				return ResponseEntity.badRequest().body(new MessageResponse("Error: Usuario no encontrado!"));
			}
			authService.updateUser(signUpRequest);
			return ResponseEntity.ok(new MessageResponse("Usuario editado con exito!"));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
		}
	}

	@DeleteMapping("/delete/{id}")
	public ResponseEntity<MessageResponse> deleteUser(@RequestParam Long id) {
		try{
			authService.deleteUser(id);
			return ResponseEntity.ok(new MessageResponse("Usuario eliminado con exito!"));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
		}
	}

}
