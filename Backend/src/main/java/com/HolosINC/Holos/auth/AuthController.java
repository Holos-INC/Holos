package com.HolosINC.Holos.auth;

import java.util.List;
import java.util.stream.Collectors;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
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
import com.HolosINC.Holos.auth.payload.request.UpdateRequest;
import com.HolosINC.Holos.auth.payload.response.JwtResponse;
import com.HolosINC.Holos.auth.payload.response.MessageResponse;
import com.HolosINC.Holos.configuration.jwt.JwtUtils;
import com.HolosINC.Holos.configuration.service.UserDetailsImpl;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "The Authentication API based on JWT")
@SecurityRequirement(name = "bearerAuth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final AuthoritiesService authService;
    
    public AuthController(AuthenticationManager authenticationManager,
            JwtUtils jwtUtils, PasswordEncoder encoder,
            AuthoritiesService authService) {
        this.jwtUtils = jwtUtils;
        this.authenticationManager = authenticationManager;
        this.authService = authService;
    }

    @Operation(summary = "Sign in", description = "Authenticate the user and return a JWT token.")
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody @Parameter(description = "User login credentials") LoginRequest loginRequest) {
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

    @Operation(summary = "Validate JWT token", description = "Validate a JWT token to check if it's still valid.")
    @GetMapping("/validate")
    public ResponseEntity<Boolean> validateToken(@RequestParam @Parameter(description = "JWT token to validate") String token) {
        Boolean isValid = jwtUtils.validateJwtToken(token);
        return ResponseEntity.ok(isValid);
    }

    @Operation(summary = "Sign up", description = "Register a new user with optional profile image and commission price table.")
    @PostMapping(value = "/signup", consumes = { "multipart/form-data" })
    public ResponseEntity<MessageResponse> registerUser(
            @RequestPart("user") @Parameter(description = "Signup request data") String signupRequestJson,
            @RequestPart(value = "imageProfile", required = false) @Parameter(description = "Profile image for the user") MultipartFile imageProfile,
            @RequestPart(value = "tableCommisionsPrice", required = false) @Parameter(description = "Table of commission prices for the user") MultipartFile tableCommisionsPrice) {

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            SignupRequest signupRequest = objectMapper.readValue(signupRequestJson, SignupRequest.class);

            if (imageProfile != null && !imageProfile.isEmpty()) 
                signupRequest.setImageProfile(imageProfile);

            if (tableCommisionsPrice != null && !tableCommisionsPrice.isEmpty()) {
                signupRequest.setTableCommisionsPrice(tableCommisionsPrice);
            }

            authService.createUser(signupRequest);
            return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("Error during registration: " + e.getMessage()));
        }
    }

    @Operation(summary = "Update user profile", description = "Update an existing user's profile with optional profile image and commission price table.")
    @PutMapping(path = "/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MessageResponse> updateUser(@RequestPart("updateUser") @Parameter(description = "User update request data") String updateRequestform,
            @RequestPart(value = "imageProfile", required = false) @Parameter(description = "Profile image for the user") MultipartFile imageProfile,
            @RequestPart(value = "tableCommisionsPrice", required = false) @Parameter(description = "Table of commission prices for the user") MultipartFile tableCommisionsPrice) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            UpdateRequest updateRequest = objectMapper.readValue(updateRequestform, UpdateRequest.class);

            if (imageProfile != null && !imageProfile.isEmpty())
                updateRequest.setImageProfile(imageProfile);

            if (tableCommisionsPrice != null && !tableCommisionsPrice.isEmpty())
                updateRequest.setTableCommisionsPrice(tableCommisionsPrice);

            authService.updateUser(updateRequest);
            return ResponseEntity.ok().body(new MessageResponse("successfully updated: " + updateRequest.getUsername()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @Operation(summary = "Delete user", description = "Delete a user by their ID.")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<MessageResponse> deleteUser(@RequestParam @Parameter(description = "ID of the user to delete") Long id) {
        try {
            authService.deleteUser(id);
            return ResponseEntity.ok(new MessageResponse("User deleted successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

}
