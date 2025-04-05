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
        return categoryRepository.save(category);
    }

    @Transactional
    public Category updateCategory(Long categoryId, Category updatedCategory) {
        try {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> {
                        return new ResourceNotFoundException("Category", "id", categoryId);
                    });

            category.setName(updatedCategory.getName());
            category.setDescription(updatedCategory.getDescription());
            category.setImage(updatedCategory.getImage());

            Category savedCategory = categoryRepository.save(category);
            return savedCategory;

        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("No se puede actualizar la categoría con ID " + categoryId +
                                       " debido a restricciones de integridad.");
        } catch (Exception e) {
            throw new RuntimeException("Error interno al actualizar la categoría con ID " + categoryId);
        }
    }

    @Transactional
    public void deleteCategory(Long categoryId) {
        try {
            List<ArtistCategory> artistCategories = artistCategoryRepository.findAllByCategoryId(categoryId);
            if (!artistCategories.isEmpty()) {
                artistCategoryRepository.deleteAll(artistCategories);
            }

            List<WorkCategory> workCategories = workCategoryRepository.findAllByCategoryId(categoryId);
            if (!workCategories.isEmpty()) {
                workCategoryRepository.deleteAll(workCategories);
            }

            categoryRepository.deleteById(categoryId);
            
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("No se puede eliminar la categoría con ID " + categoryId + 
                                       " debido a restricciones de integridad.");
        } catch (Exception e) {
            throw new RuntimeException("Error interno al eliminar la categoría con ID " + categoryId);
        }
    }

}