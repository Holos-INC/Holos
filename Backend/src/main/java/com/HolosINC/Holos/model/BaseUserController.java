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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/baseUser")
@Tag(name = "Base User Controller", description = "The API for all users")
public class BaseUserController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final BaseUserService baseUserService;

    @Autowired
    public BaseUserController(AuthenticationManager authenticationManager, JwtUtils jwtUtils, BaseUserService baseUserService) {
        this.baseUserService = baseUserService;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    @Operation(summary = "Get all users", description = "Retrieve a list of all users.")
    @GetMapping("/administrator/users")
    public ResponseEntity<List<BaseUser>> getAllUsers() {
        return ResponseEntity.ok(baseUserService.getAllUsers());
    }

    @Operation(summary = "Get user by ID", description = "Retrieve a user by their ID.")
    @GetMapping("/administrator/users/{id}")
    public ResponseEntity<BaseUser> getUserById(@PathVariable @Parameter(description = "ID of the user to retrieve") Long id) {
        return ResponseEntity.ok(baseUserService.getUserById(id));
    }

    @Operation(summary = "Update user details", description = "Update the details of an existing user.")
    @PutMapping("/administrator/users/{id}")
    public ResponseEntity<?> updateUserAdmins(@PathVariable @Parameter(description = "ID of the user to update") Long id, 
                                              @RequestBody @Valid BaseUser updatedUser) {
        try {
            return ResponseEntity.ok(baseUserService.updateUserAdmins(id, updatedUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Change user role", description = "Change the role of a user.")
    @PutMapping("/administrator/users/{id}/role")
    public ResponseEntity<?> changeUserRole(@PathVariable @Parameter(description = "ID of the user whose role is to be changed") Long id, 
                                            @RequestParam @Parameter(description = "New role to assign to the user") String newRole) {
        try {
            return ResponseEntity.ok(baseUserService.changeUserRole(id, newRole));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al cambiar el rol: " + e.getMessage());
        }
    }
}
//swagger