package com.HolosINC.Holos.model;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;


import com.HolosINC.Holos.configuration.jwt.JwtUtils;

import io.swagger.v3.oas.annotations.tags.Tag;


@RestController
@RequestMapping("/api/v1/baseUser")
@Tag(name = "Base User Controller", description = "The API for all users")
public class BaseUserController {

	@SuppressWarnings("unused")
	private final AuthenticationManager authenticationManager;
	@SuppressWarnings("unused")
	private final JwtUtils jwtUtils;
	private final BaseUserService baseUserService;

	@Autowired
	public BaseUserController(AuthenticationManager authenticationManager, JwtUtils jwtUtils, BaseUserService baseUserService) {
		this.baseUserService = baseUserService;
		this.authenticationManager = authenticationManager;
		this.jwtUtils = jwtUtils;
	}

	@GetMapping("/administrator/users")
    public ResponseEntity<List<BaseUser>> getAllUsers() {
        return ResponseEntity.ok(baseUserService.getAllUsers());
    }

    @GetMapping("/administrator/users/{id}")
    public ResponseEntity<BaseUser> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(baseUserService.getUserById(id));
    }

    @PutMapping("/administrator/users/{id}")
    public ResponseEntity<BaseUser> updateUser(@PathVariable Long id, @RequestBody BaseUser updatedUser) {
        try {
            return ResponseEntity.ok(baseUserService.updateUser(id, updatedUser));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @PutMapping("/administrator/users/{id}/role")
    public ResponseEntity<?> changeUserRole(@PathVariable Long id, @RequestParam String newRole) {
        try {
            return ResponseEntity.ok(baseUserService.changeUserRole(id, newRole));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al cambiar el rol: " + e.getMessage());
        }
    }
}