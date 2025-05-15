package com.HolosINC.Holos.model;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.HolosINC.Holos.util.EntityToDTOMapper;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/baseUser")
@Tag(name = "Base User Controller", description = "The API for all users")
public class BaseUserController {

    @Autowired
    private BaseUserService baseUserService;

    @Operation(
        summary = "Get all users",
        description = "Retrieve a list of all users in the system.",
        responses = {
            @ApiResponse(responseCode = "200", description = "List of users retrieved successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = BaseUser.class))),
            @ApiResponse(responseCode = "400", description = "Error retrieving users", content = @Content(mediaType = "application/json"))
        }
    )
    @GetMapping("/administrator/users")
    public ResponseEntity<List<BaseUser>> getAllUsers() {
        return ResponseEntity.ok(baseUserService.getAllUsers());
    }

    @Operation(
        summary = "Get user by ID",
        description = "Retrieve user details by user ID.",
        responses = {
            @ApiResponse(responseCode = "200", description = "User found", content = @Content(mediaType = "application/json", schema = @Schema(implementation = BaseUser.class))),
            @ApiResponse(responseCode = "404", description = "User not found", content = @Content(mediaType = "application/json"))
        }
    )
    @GetMapping("/administrator/users/{id}")
    public ResponseEntity<BaseUser> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(baseUserService.getUserById(id));
    }

    @Operation(
        summary = "Update user details",
        description = "Update the details of a user (for admin users).",
        responses = {
            @ApiResponse(responseCode = "200", description = "User updated successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = BaseUser.class))),
            @ApiResponse(responseCode = "400", description = "Error updating user", content = @Content(mediaType = "application/json"))
        }
    )
    @PutMapping("/administrator/users/{id}")
    public ResponseEntity<?> updateUserAdmins(@PathVariable Long id, @RequestBody @Valid BaseUser updatedUser) {
        try {
            return ResponseEntity.ok(baseUserService.updateUserAdmins(id, updatedUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(
        summary = "Get user by username",
        description = "Retrieve user details by username.",
        responses = {
            @ApiResponse(responseCode = "200", description = "User found", content = @Content(mediaType = "application/json", schema = @Schema(implementation = BaseUserDTO.class))),
            @ApiResponse(responseCode = "404", description = "User not found", content = @Content(mediaType = "application/json"))
        }
    )
    @GetMapping("/username/{username}")
    public ResponseEntity<BaseUserDTO> getUserByUsername(@PathVariable String username) {
        BaseUser user = baseUserService.getUserByUsername(username);
        BaseUserDTO userDTO = EntityToDTOMapper.toBaseUserDTO(user);
        return ResponseEntity.ok(userDTO);
    }

    @Operation(
        summary = "Change user role",
        description = "Change the role of a user.",
        responses = {
            @ApiResponse(responseCode = "200", description = "User role changed successfully"),
            @ApiResponse(responseCode = "400", description = "Error changing user role", content = @Content(mediaType = "application/json"))
        }
    )
    @PutMapping("/administrator/users/{id}/role")
    public ResponseEntity<?> changeUserRole(@PathVariable Long id, @RequestParam String newRole) {
        try {
            return ResponseEntity.ok(baseUserService.changeUserRole(id, newRole));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al cambiar el rol: " + e.getMessage());
        }
    }
}
