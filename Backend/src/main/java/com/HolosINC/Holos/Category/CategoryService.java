package com.HolosINC.Holos.Category;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.artist.ArtistRepository;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.work.Work;
import com.HolosINC.Holos.work.WorkRepository;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final WorkCategoryRepository workCategoryRepository;
    private final ArtistCategoryRepository artistCategoryRepository;
    private final ArtistRepository artistRepository;
    private final WorkRepository workRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository, WorkCategoryRepository workCategoryRepository, ArtistCategoryRepository artistCategoryRepository,
    ArtistRepository artistRepository, WorkRepository workRepository) {
        this.categoryRepository = categoryRepository;
        this.workCategoryRepository = workCategoryRepository;
        this.artistCategoryRepository = artistCategoryRepository;
        this.artistRepository = artistRepository;
        this.workRepository = workRepository;
    }

    @Transactional(readOnly = true)
    public List<Category> findAllCategories() {
        return categoryRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Category> findCategoriesByWork(Long workId) {
        Work work = workRepository.findById(workId)
            .orElseThrow(() -> new ResourceNotFoundException("Work", "workId", workId));
        List<Category> categories = workCategoryRepository.findCategoriesOfWork(workId);
        return categories;
    }

    @Transactional(readOnly = true)
    public List<Category> findCategoriesByArtist(Long artistId) {
        Artist artist = artistRepository.findById(artistId)
            .orElseThrow(() -> new ResourceNotFoundException("Artist", "artistId", artistId));
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
}
