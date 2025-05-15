package com.HolosINC.Holos.Category;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.HolosINC.Holos.exceptions.ResourceNotFoundException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/categories")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Category", description = "API for managing categories")
public class CategoryRestController {

    private final CategoryService categoryService;

    public CategoryRestController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @Operation(summary = "Get all categories", description = "Retrieve a list of all categories.")
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return new ResponseEntity<>(categoryService.findAllCategories(), HttpStatus.OK);
    }

    @Operation(summary = "Get category by ID", description = "Retrieve a category's details by its ID.")
    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(
        @PathVariable @Parameter(description = "ID of the category to retrieve") Long id) {
        return new ResponseEntity<>(categoryService.findCategoryById(id), HttpStatus.OK);
    }

    @Operation(summary = "Get all categories (Admin)", description = "Retrieve a list of all categories for admin.")
    @GetMapping("/administrator/categories")
    public ResponseEntity<List<Category>> getAllCategoriesAdmin() {
        List<Category> categories = categoryService.findAllCategories();
        return ResponseEntity.ok(categories);
    }

    @Operation(summary = "Create a category", description = "Create a new category.")
    @PostMapping("/administrator/categories")
    public ResponseEntity<Category> createCategory(
        @RequestBody @Parameter(description = "Category details to be created") Category category) {
        try {
            Category newCategory = categoryService.saveCategory(category);
            return ResponseEntity.status(HttpStatus.CREATED).body(newCategory);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @Operation(summary = "Update a category", description = "Update an existing category by its ID.")
    @PutMapping("/administrator/categories/{id}")
    public ResponseEntity<Category> updateCategory(
        @PathVariable @Parameter(description = "ID of the category to be updated") Long id, 
        @RequestBody @Parameter(description = "Updated category details") Category updatedCategory) {
        try {
            Category category = categoryService.updateCategory(id, updatedCategory);
            return ResponseEntity.ok(category);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(null);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @Operation(summary = "Delete a category", description = "Delete a category by its ID.")
    @DeleteMapping("/administrator/categories/{id}")
    public ResponseEntity<?> deleteCategory(
        @PathVariable @Parameter(description = "ID of the category to delete") Long id) {
        try {
            categoryService.deleteCategory(id);
            return ResponseEntity.ok().body("Categoría eliminada exitosamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error interno al eliminar la categoría");
        }
    }
}
