package com.HolosINC.Holos.Category;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.HolosINC.Holos.exceptions.ResourceNotFoundException;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final WorkCategoryRepository workCategoryRepository;
    private final ArtistCategoryRepository artistCategoryRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository, WorkCategoryRepository workCategoryRepository, ArtistCategoryRepository artistCategoryRepository) {
        this.categoryRepository = categoryRepository;
        this.workCategoryRepository = workCategoryRepository;
        this.artistCategoryRepository = artistCategoryRepository;
    }

    private void validateImage(byte[] image) {
        if (image == null || image.length == 0) return;
    
        try {
            if (javax.imageio.ImageIO.read(new java.io.ByteArrayInputStream(image)) == null) {
                throw new IllegalArgumentException("Formato de imagen no válido.");
            }
        } catch (Exception e) {
            throw new IllegalArgumentException("Error al procesar la imagen: no es válida.");
        }
    }
    

    @Transactional(readOnly = true)
    public List<Category> findAllCategories() {
        return categoryRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Category> findCategoriesByWork(Long workId) {
        List<Category> categories = workCategoryRepository.findCategoriesOfWork(workId);
        return categories;
    }

    @Transactional(readOnly = true)
    public List<Category> findCategoriesByArtist(Long artistId) {
        List<Category> categories = artistCategoryRepository.findCategoriesOfArtist(artistId);
        return categories;
    }

    @Transactional(readOnly = true)
    public Category findCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }
    
    @Transactional
    public Category saveCategory(Category category) {
        validateImage(category.getImage());
        return categoryRepository.save(category);
    }

    @Transactional
    public Category updateCategory(Long categoryId, Category updatedCategory) {
        try {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));
    
            validateImage(updatedCategory.getImage());
    
            category.setName(updatedCategory.getName());
            category.setDescription(updatedCategory.getDescription());
            category.setImage(updatedCategory.getImage());
    
            return categoryRepository.save(category);
    
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (IllegalArgumentException e) {
            throw e; // será capturado en el controlador
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("No se puede actualizar la categoría con ID " + categoryId +
                                       " debido a restricciones de integridad.");
        } catch (Exception e) {
            throw new RuntimeException("Error interno al actualizar la categoría con ID " + categoryId);
        }
    }
    

    @Transactional
    public void deleteCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new IllegalStateException("La categoría con ID " + categoryId + " no existe."));
    
        try {
            boolean hasWorkRelations = workCategoryRepository.existsByCategoryId(categoryId);
            if (hasWorkRelations) {
                throw new IllegalStateException("La categoría con ID " + categoryId + " no se puede eliminar porque está asociada a uno o más trabajos.");
            }
    
            List<ArtistCategory> artistCategories = artistCategoryRepository.findAllByCategoryId(categoryId);
            if (!artistCategories.isEmpty()) {
                artistCategoryRepository.deleteAll(artistCategories);
            }
    
            categoryRepository.deleteById(categoryId);
    
        } catch (IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error interno al eliminar la categoría con ID " + categoryId + ": " + e.getMessage(), e);
        }
    }     

    @Transactional
    public void deleteAllByArtistId(Long artistId) {
        List<ArtistCategory> categories = artistCategoryRepository.findAllByArtistId(artistId);
        artistCategoryRepository.deleteAll(categories);
    }

}
