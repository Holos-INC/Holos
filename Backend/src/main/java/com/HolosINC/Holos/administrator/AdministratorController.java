package com.HolosINC.Holos.administrator;

import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserService;

import io.swagger.v3.oas.annotations.tags.Tag;

import com.HolosINC.Holos.Category.Category;
import com.HolosINC.Holos.Category.CategoryService;
import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.artist.ArtistService;
import com.HolosINC.Holos.auth.Authorities;
import com.HolosINC.Holos.auth.AuthoritiesRepository;
import com.HolosINC.Holos.client.Client;
import com.HolosINC.Holos.client.ClientService;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/administrator")
@Tag(name = "Administrator Controller", description = "The API for administrators")
public class AdministratorController {

    private final BaseUserService baseUserService;
    private final ArtistService artistService;
    private final ClientService clientService;
    private final CategoryService categoryService;


    @Autowired
    public AdministratorController(BaseUserService baseUserService, AuthoritiesRepository authoritiesRepository, ArtistService artistService, ClientService clientService, CategoryService categoryService) {
        this.baseUserService = baseUserService;
        this.artistService = artistService;
        this.clientService = clientService;
        this.categoryService = categoryService;
    }

    /*GESTION DE USUARIOS */

    @GetMapping("/users")
    public ResponseEntity<List<BaseUser>> getAllUsers() {
        return ResponseEntity.ok(baseUserService.getAllUsers());
    }

    @GetMapping("/artists")
    public ResponseEntity<List<BaseUser>> getAllArtists() {
        return ResponseEntity.ok(baseUserService.getAllUsersByRole("ARTIST"));
    }

    @GetMapping("/clients")
    public ResponseEntity<List<BaseUser>> getAllClients() {
        return ResponseEntity.ok(baseUserService.getAllUsersByRole("CLIENT"));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<BaseUser> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(baseUserService.getUserById(id));
    }

    @GetMapping("/artists/{id}")
    public ResponseEntity<Artist> getArtistById(@PathVariable Long id) {
        try {
            Artist artist = artistService.findArtist(id);
            return ResponseEntity.ok(artist);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(null);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @GetMapping("/clients/{id}")
    public ResponseEntity<Client> getClientById(@PathVariable Long id) {
        try {
            Client client = clientService.findClient(id);
            return ResponseEntity.ok(client);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(null);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }
    
    @PostMapping("/artists/{id}")
    public ResponseEntity<?> createArtist(@RequestBody Artist artist) {
        try {
            Artist createdArtist = artistService.createArtist(artist);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdArtist);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error interno al crear el artista.");
        }
    }

    @PostMapping("/clients/{id}")
    public ResponseEntity<?> createClient(@RequestBody Client client) {
        try {
            Client createdClient = clientService.createClient(client);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdClient);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error interno al crear el cliente.");
        }
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<BaseUser> updateUser(@PathVariable Long id, @RequestBody BaseUser updatedUser) {
        try {
            return ResponseEntity.ok(baseUserService.updateUser(id, updatedUser));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @PutMapping("/artists/{id}")
    public ResponseEntity<Artist> updateArtist(@PathVariable Long id, @RequestBody Artist updatedArtist) {
        try {
            Artist artist = artistService.updateArtist(id, updatedArtist);
            return ResponseEntity.ok(artist);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @PutMapping("/clients/{id}")
    public ResponseEntity<Client> updateClient(@PathVariable Long id, @RequestBody Client updatedClient) {
        try {
            Client client = clientService.updateClient(id, updatedClient);
            return ResponseEntity.ok(client);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> changeUserRole(@PathVariable Long id, @RequestParam String newRole) {
        try {
            return ResponseEntity.ok(baseUserService.changeUserRole(id, newRole));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al cambiar el rol: " + e.getMessage());
        }
    }

    @DeleteMapping("/artists/{id}")
    public ResponseEntity<?> deleteArtist(@PathVariable Long id) {
        try {
            artistService.deleteArtist(id);
            return ResponseEntity.ok().body("Artista eliminado exitosamente");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error interno al eliminar el artista");
        }
    }

    @DeleteMapping("/clients/{id}")
    public ResponseEntity<?> deleteClient(@PathVariable Long id) {
        try {
            clientService.deleteClient(id);
            return ResponseEntity.ok().body("Cliente eliminado exitosamente");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error interno al eliminar el cliente");
        }
    }

    /*GESTION DE CATEGORIAS */

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryService.findAllCategories();
        return ResponseEntity.ok(categories);
    }

    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        try {
            Category newCategory = categoryService.saveCategory(category);
            return ResponseEntity.status(HttpStatus.CREATED).body(newCategory);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody Category updatedCategory) {
        try {
            Category category = categoryService.updateCategory(id, updatedCategory);
            return ResponseEntity.ok(category);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(null);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        try {
            categoryService.deleteCategory(id);
            return ResponseEntity.ok().body("Categoría eliminada exitosamente");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error interno al eliminar la categoría");
        }
    }


}
