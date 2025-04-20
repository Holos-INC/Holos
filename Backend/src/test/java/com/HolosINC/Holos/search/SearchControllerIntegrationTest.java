package com.HolosINC.Holos.search;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

@SpringBootTest
@AutoConfigureMockMvc
public class SearchControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void searchWorksShouldReturnOkWithResults() throws Exception {
        mockMvc.perform(get("/api/v1/search/works")
                .param("query", "Painting"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    public void searchWorksWithoutParamsShouldReturnOk() throws Exception {
        mockMvc.perform(get("/api/v1/search/works"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    public void searchWorksWithPriceRangeShouldReturnOk() throws Exception {
        mockMvc.perform(get("/api/v1/search/works")
                .param("minPrice", "100")
                .param("maxPrice", "300"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    public void searchWorksWithInvalidPriceRangeShouldReturnBadRequest() throws Exception {
        mockMvc.perform(get("/api/v1/search/works")
                .param("minPrice", "500")
                .param("maxPrice", "100"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$").value(org.hamcrest.Matchers.containsString("minPrice no puede ser mayor")));
    }

    @Test
    public void searchWorksWithNoResultsShouldReturnEmptyList() throws Exception {
        mockMvc.perform(get("/api/v1/search/works")
                .param("query", "zzzzzzzzz"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(0));
    }

    @Test
    public void searchArtistsShouldReturnOk() throws Exception {
        mockMvc.perform(get("/api/v1/search/artists")
                .param("query", "alex"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    public void searchArtistsWithMinWorksDoneShouldReturnOk() throws Exception {
        mockMvc.perform(get("/api/v1/search/artists")
                .param("minWorksDone", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    public void searchArtistsWithInvalidMinWorksDoneShouldReturnBadRequest() throws Exception {
        mockMvc.perform(get("/api/v1/search/artists")
                .param("minWorksDone", "-1"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$")
                        .value(org.hamcrest.Matchers.containsString("minWorksDone no puede ser negativo")));
    }

    @Test
    public void searchArtistsWithQueryAndMinWorksDoneShouldReturnOk() throws Exception {
        mockMvc.perform(get("/api/v1/search/artists")
                .param("query", "alex")
                .param("minWorksDone", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    public void searchWorksByArtistShouldReturnOk() throws Exception {
        mockMvc.perform(get("/api/v1/search/artists/1/works"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    public void searchWorksByArtistWithPaginationShouldReturnOk() throws Exception {
        mockMvc.perform(get("/api/v1/search/artists/1/works")
                .param("page", "0")
                .param("size", "2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(org.hamcrest.Matchers.lessThanOrEqualTo(2)));
    }

    @Test
    public void searchWorksByNonExistentArtistShouldReturnEmptyList() throws Exception {
        mockMvc.perform(get("/api/v1/search/artists/9999/works"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(0));
    }

    @Test
    public void searchAllShouldReturnOk() throws Exception {
        mockMvc.perform(get("/api/v1/search/all")
                .param("query", "sunset"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    public void searchAllWithAllFiltersShouldReturnOk() throws Exception {
        mockMvc.perform(get("/api/v1/search/all")
                .param("query", "sunset")
                .param("minWorksDone", "1")
                .param("minPrice", "100")
                .param("maxPrice", "300"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    public void searchAllWithOnlyMinWorksDoneShouldReturnOk() throws Exception {
        mockMvc.perform(get("/api/v1/search/all")
                .param("minWorksDone", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    public void searchAllWithOnlyPriceRangeShouldReturnOk() throws Exception {
        mockMvc.perform(get("/api/v1/search/all")
                .param("minPrice", "100")
                .param("maxPrice", "300"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    } 

 //added

    @Test
    public void testSearchWorksWithInvalidPriceRange() throws Exception{
        mockMvc.perform(get("/api/v1/search/works").param("minPrice", "300").param("maxPrice", 
        "100"))
        .andExpect(status().isBadRequest())
        .andExpect(content().string("Error: minPrice no puede ser mayor que maxPrice."));

    }

    @Test
    public void testSearchAllPaginationBeyondMaxResults() throws Exception {
    mockMvc.perform(get("/api/v1/search/all")
            .param("query", "art")
            .param("page", "9999")  // Página con más resultados de los disponibles
            .param("size", "10"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content").isEmpty());  
}

    @Test 
    public void testSearchWorksByNonExistentArtist() throws Exception {
        mockMvc.perform(get("/api/v1/search/artists/9999/works"))  // ID de artista que no existe
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isEmpty());  // Se espera una lista vacía
    }

    @Test
    public void testSearchArtitstWithNegativeMinWorksDone() throws Exception{
        mockMvc.perform(get("/api/v1/search/artists")
        .param("minWorksDone", "-1"))
        .andExpect(status().isBadRequest()).andExpect(content().string("Error: minWorksDone no puede ser negativo."));

    }

    @Test
public void testSearchAllWithoutParameters() throws Exception {
    mockMvc.perform(get("/api/v1/search/all"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content").isArray());
}




}