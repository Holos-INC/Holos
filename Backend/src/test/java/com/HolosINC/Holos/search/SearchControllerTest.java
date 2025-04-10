package com.HolosINC.Holos.search;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.exceptions.ResourceNotOwnedException;
import com.HolosINC.Holos.search.DTOs.SearchWorkDTO;

public class SearchControllerTest {

    private MockMvc mockMvc;

    @Mock
    private SearchService searchService;

    @InjectMocks
    private SearchController searchController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(searchController).build();
    }

    @Test
    public void testSearchWorksWithAllParams() throws Exception {
        SearchWorkDTO dto = mock(SearchWorkDTO.class);
        Page<SearchWorkDTO> mockPage = new PageImpl<>(List.of(dto), PageRequest.of(0, 10), 1);

        when(searchService.searchWorks("cuadro", 50.0, 150.0, 0, 10)).thenReturn(mockPage);

        mockMvc.perform(get("/api/v1/search/works")
                .param("query", "cuadro")
                .param("minPrice", "50.0")
                .param("maxPrice", "150.0")
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(searchService, times(1)).searchWorks("cuadro", 50.0, 150.0, 0, 10);
    }

    @Test
    public void testSearchWorksWithDefaultParams() throws Exception {
        SearchWorkDTO dto = mock(SearchWorkDTO.class);

        Page<SearchWorkDTO> mockPage = new PageImpl<>(List.of(dto), PageRequest.of(0, 10), 1);

        when(searchService.searchWorks(null, null, null, 0, 10)).thenReturn(mockPage);

        mockMvc.perform(get("/api/v1/search/works"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(searchService, times(1)).searchWorks(null, null, null, 0, 10);
    }

    @Test
    public void testSearchWorksWithOnlyQuery() throws Exception {
        SearchWorkDTO dto = mock(SearchWorkDTO.class);

        Page<SearchWorkDTO> mockPage = new PageImpl<>(List.of(dto), PageRequest.of(0, 10), 1);

        when(searchService.searchWorks("paisaje", null, null, 0, 10)).thenReturn(mockPage);

        mockMvc.perform(get("/api/v1/search/works")
                .param("query", "paisaje"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(searchService, times(1)).searchWorks("paisaje", null, null, 0, 10);
    }

    @Test
    public void testSearchWorksWithMinAndMaxPriceOnly() throws Exception {
        SearchWorkDTO dto = mock(SearchWorkDTO.class);
        Page<SearchWorkDTO> mockPage = new PageImpl<>(List.of(dto), PageRequest.of(0, 10), 1);

        when(searchService.searchWorks(null, 20.0, 80.0, 0, 10)).thenReturn(mockPage);

        mockMvc.perform(get("/api/v1/search/works")
                .param("minPrice", "20.0")
                .param("maxPrice", "80.0"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(searchService, times(1)).searchWorks(null, 20.0, 80.0, 0, 10);
    }

    @Test
    public void testSearchWorksWithEmptyResults() throws Exception {
        Page<SearchWorkDTO> emptyPage = new PageImpl<>(List.of(), PageRequest.of(0, 10), 0);
        when(searchService.searchWorks("nada", null, null, 0,
                10)).thenReturn(emptyPage);

        mockMvc.perform(get("/api/v1/search/works")
                .param("query", "nada"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isEmpty());

        verify(searchService).searchWorks("nada", null, null, 0, 10);
    }

    @Test
    public void testSearchWorksPaginationSecondPage() throws Exception {
        SearchWorkDTO dto = new SearchWorkDTO(); // Crea el DTO que espera el controlador
        Page<SearchWorkDTO> mockPage = new PageImpl<>(List.of(dto), PageRequest.of(1, 10), 11);

        when(searchService.searchWorks(null, null, null, 1, 10)).thenReturn(mockPage);

        mockMvc.perform(get("/api/v1/search/works")
                .param("page", "1")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.number").value(1)); // Verifica que esté en la página 1 (segunda página)

        verify(searchService).searchWorks(null, null, null, 1, 10);
    }

    @Test
    public void testSearchWorksInvalidPageParam() throws Exception {
        when(searchService.searchWorks(null, null, null, -1, 10))
                .thenThrow(new ResourceNotOwnedException("El número de página no puede ser negativo."));

        mockMvc.perform(get("/api/v1/search/works")
                .param("page", "-1"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Error: El número de página no puede ser negativo."));

        verify(searchService).searchWorks(null, null, null, -1, 10);
    }

    @Test
    public void testSearchArtistsWithAllParams() throws Exception {
        Page<Artist> mockPage = new PageImpl<>(List.of(new Artist()), PageRequest.of(0, 10), 1);
        when(searchService.searchArtists("juan", 3, 0, 10)).thenReturn(mockPage);

        mockMvc.perform(get("/api/v1/search/artists")
                .param("query", "juan")
                .param("minWorksDone", "3")
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(searchService).searchArtists("juan", 3, 0, 10);
    }

    @Test
    public void testSearchArtistsWithOnlyQuery() throws Exception {
        Page<Artist> mockPage = new PageImpl<>(List.of(new Artist()), PageRequest.of(0, 10), 1);
        when(searchService.searchArtists("maria", null, 0, 10)).thenReturn(mockPage);

        mockMvc.perform(get("/api/v1/search/artists")
                .param("query", "maria"))
                .andExpect(status().isOk());

        verify(searchService).searchArtists("maria", null, 0, 10);
    }

    @Test
    public void testSearchArtistsWithOnlyMinWorksDone() throws Exception {
        Page<Artist> mockPage = new PageImpl<>(List.of(new Artist()), PageRequest.of(0, 10), 1);
        when(searchService.searchArtists(null, 5, 0, 10)).thenReturn(mockPage);

        mockMvc.perform(get("/api/v1/search/artists")
                .param("minWorksDone", "5"))
                .andExpect(status().isOk());

        verify(searchService).searchArtists(null, 5, 0, 10);
    }

    @Test
    public void testSearchArtistsWithDefaultParams() throws Exception {
        Page<Artist> mockPage = new PageImpl<>(List.of(new Artist()), PageRequest.of(0, 10), 1);
        when(searchService.searchArtists(null, null, 0, 10)).thenReturn(mockPage);

        mockMvc.perform(get("/api/v1/search/artists"))
                .andExpect(status().isOk());

        verify(searchService).searchArtists(null, null, 0, 10);
    }

    @Test
    public void testSearchArtistsWithInvalidMinWorksDone() throws Exception {
        when(searchService.searchArtists(null, -1, 0, 10))
                .thenThrow(new ResourceNotOwnedException("minWorksDone no puede ser negativo."));

        mockMvc.perform(get("/api/v1/search/artists")
                .param("minWorksDone", "-1"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Error: minWorksDone no puede ser negativo."));

        verify(searchService).searchArtists(null, -1, 0, 10);
    }

    @Test
    public void testSearchArtistsPaginationPage1() throws Exception {
        Page<Artist> mockPage = new PageImpl<>(List.of(new Artist()), PageRequest.of(1, 10), 11);
        when(searchService.searchArtists(null, null, 1, 10)).thenReturn(mockPage);

        mockMvc.perform(get("/api/v1/search/artists")
                .param("page", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.number").value(1));

        verify(searchService).searchArtists(null, null, 1, 10);
    }

    @Test
    public void testSearchArtistsEmptyResults() throws Exception {
        Page<Artist> emptyPage = new PageImpl<>(List.of(), PageRequest.of(0, 10), 0);
        when(searchService.searchArtists("nobody", null, 0, 10)).thenReturn(emptyPage);

        mockMvc.perform(get("/api/v1/search/artists")
                .param("query", "nobody"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isEmpty());

        verify(searchService).searchArtists("nobody", null, 0, 10);
    }

    /*
     * @Test
     * public void testSearchWorksByArtistWithDefaultPagination() throws Exception {
     * Page<Work> mockPage = new PageImpl<>(List.of(new Work()), PageRequest.of(0,
     * 10), 1);
     * when(searchService.searchWorksByArtist(1, 0, 10)).thenReturn(mockPage);
     * 
     * mockMvc.perform(get("/api/v1/search/artists/1/works"))
     * .andExpect(status().isOk())
     * .andExpect(content().contentType(MediaType.APPLICATION_JSON));
     * 
     * verify(searchService).searchWorksByArtist(1, 0, 10);
     * }
     * 
     * @Test
     * public void testSearchWorksByArtistWithCustomPagination() throws Exception {
     * Page<Work> mockPage = new PageImpl<>(List.of(new Work()), PageRequest.of(2,
     * 5), 15);
     * when(searchService.searchWorksByArtist(2, 2, 5)).thenReturn(mockPage);
     * 
     * mockMvc.perform(get("/api/v1/search/artists/2/works")
     * .param("page", "2")
     * .param("size", "5"))
     * .andExpect(status().isOk())
     * .andExpect(jsonPath("$.number").value(2));
     * 
     * verify(searchService).searchWorksByArtist(2, 2, 5);
     * }
     */
    @Test
    public void testSearchWorksByArtistInvalidPage() throws Exception {
        when(searchService.searchWorksByArtist(3, -1, 10))
                .thenThrow(new ResourceNotOwnedException("El número de página no puede ser negativo."));

        mockMvc.perform(get("/api/v1/search/artists/3/works")
                .param("page", "-1"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Error: El número de página no puede ser negativo."));

        verify(searchService).searchWorksByArtist(3, -1, 10);
    }

    @Test
    public void testSearchAllWithAllParams() throws Exception {
        Map<String, Object> dummyResult = Map.of("type", "work", "title", "obra de prueba");
        Page<Object> mockPage = new PageImpl<>(List.of(dummyResult), PageRequest.of(0, 10), 1);

        when(searchService.searchAll("arte", 2, 10.0, 200.0, 0, 10)).thenReturn(mockPage);

        mockMvc.perform(get("/api/v1/search/all")
                .param("query", "arte")
                .param("minWorksDone", "2")
                .param("minPrice", "10.0")
                .param("maxPrice", "200.0")
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(searchService).searchAll("arte", 2, 10.0, 200.0, 0, 10);
    }

    @Test
    public void testSearchAllWithNoParams() throws Exception {
        Page<Object> mockPage = new PageImpl<>(List.of(), PageRequest.of(0, 10), 0);
        when(searchService.searchAll(null, null, null, null, 0, 10)).thenReturn(mockPage);

        mockMvc.perform(get("/api/v1/search/all"))
                .andExpect(status().isOk());

        verify(searchService).searchAll(null, null, null, null, 0, 10);
    }

    @Test
    public void testSearchAllWithQueryOnly() throws Exception {
        Map<String, Object> dummyResult = Map.of("type", "artist", "name", "abstracto");
        Page<Object> mockPage = new PageImpl<>(List.of(dummyResult), PageRequest.of(0, 10), 1);

        when(searchService.searchAll("abstracto", null, null, null, 0, 10)).thenReturn(mockPage);

        mockMvc.perform(get("/api/v1/search/all")
                .param("query", "abstracto"))
                .andExpect(status().isOk());

        verify(searchService).searchAll("abstracto", null, null, null, 0, 10);
    }

    @Test
    public void testSearchAllWithInvalidPriceRange() throws Exception {
        when(searchService.searchAll("x", null, 200.0, 100.0, 0, 10))
                .thenThrow(new ResourceNotOwnedException("minPrice no puede ser mayor que maxPrice."));

        mockMvc.perform(get("/api/v1/search/all")
                .param("query", "x")
                .param("minPrice", "200.0")
                .param("maxPrice", "100.0"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Error: minPrice no puede ser mayor que maxPrice."));

        verify(searchService).searchAll("x", null, 200.0, 100.0, 0, 10);
    }

    @Test
    public void testSearchAllWithInvalidMinWorksDone() throws Exception {
        when(searchService.searchAll(null, -5, null, null, 0, 10))
                .thenThrow(new ResourceNotOwnedException("minWorksDone no puede ser negativo."));

        mockMvc.perform(get("/api/v1/search/all")
                .param("minWorksDone", "-5"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Error: minWorksDone no puede ser negativo."));

        verify(searchService).searchAll(null, -5, null, null, 0, 10);
    }

}
