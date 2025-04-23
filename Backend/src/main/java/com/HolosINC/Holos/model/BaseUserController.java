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

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/v1/baseUser")
@Tag(name = "Base User Controller", description = "The API for all users")
public class BaseUserController {

    @Autowired
	private BaseUserService baseUserService;

	@GetMapping("/administrator/users")
    public ResponseEntity<List<BaseUser>> getAllUsers() {
        return ResponseEntity.ok(baseUserService.getAllUsers());
    }

    @GetMapping("/administrator/users/{id}")
    public ResponseEntity<BaseUser> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(baseUserService.getUserById(id));
    }

    @PutMapping("/administrator/users/{id}")
    public ResponseEntity<?> updateUserAdmins(@PathVariable Long id, @RequestBody @Valid BaseUser updatedUser) {
        try {
            return ResponseEntity.ok(baseUserService.updateUserAdmins(id, updatedUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<BaseUserDTO> getUserByUsername(@PathVariable String username) {
        BaseUser user = baseUserService.getUserByUsername(username);
        BaseUserDTO userDTO = EntityToDTOMapper.toBaseUserDTO(user);
        return ResponseEntity.ok(userDTO);
    }

    @PutMapping("/administrator/users/{id}/role")
    public ResponseEntity<?> changeUserRole(@PathVariable Long id, @RequestParam String newRole) {
        try {
            return ResponseEntity.ok(baseUserService.changeUserRole(id, newRole));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al cambiar el rol: " + e.getMessage());
        }
    }
}