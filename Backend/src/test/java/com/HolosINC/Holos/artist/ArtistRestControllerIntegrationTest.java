package com.HolosINC.Holos.artist;

import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserDTO;
import com.HolosINC.Holos.model.BaseUserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
public class ArtistRestControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ArtistRepository artistRepository;

    @Autowired
    private BaseUserRepository baseUserRepository;

    private Long savedArtistId;

    @BeforeEach
    public void setUp() {
        artistRepository.deleteAll();
        baseUserRepository.deleteAll();

        BaseUser user = new BaseUser();
        user.setUsername("artistTest");
        user.setEmail("artist@test.com");
        user.setName("Test Artist");
        baseUserRepository.save(user);

        Artist artist = new Artist();
        artist.setBaseUser(user);
        artist.setDescription("Integration test artist");
        artist.setNumSlotsOfWork(3);
        artist = artistRepository.save(artist);

        savedArtistId = artist.getId();
    }

    @Test
    public void testFindByIdShouldReturnArtist() throws Exception {
        mockMvc.perform(get("/api/v1/artists/" + savedArtistId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.artistId").value(savedArtistId))
                .andExpect(jsonPath("$.description").value("Integration test artist"))
                .andExpect(jsonPath("$.username").value("artistTest"));
    }

    @Test
    public void testFindByUsernameShouldReturnArtist() throws Exception {
        mockMvc.perform(get("/api/v1/artists/username/artistTest"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.baseUser.username").value("artistTest"))
                .andExpect(jsonPath("$.description").value("Integration test artist"));
    }

    @Test
    public void testFindByInvalidIdShouldReturnBadRequest() throws Exception {
        mockMvc.perform(get("/api/v1/artists/9999"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(containsString("Artist not found")));
    }

    @Test
    public void testFindByInvalidUsernameShouldReturnBadRequest() throws Exception {
        mockMvc.perform(get("/api/v1/artists/username/nonexistent"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(containsString("Artist not found")));
    }

    @Test
    public void testUpdateProfileShouldReturnUpdatedUser() throws Exception {
        ObjectMapper mapper = new ObjectMapper();

        BaseUserDTO updatedUser = new BaseUserDTO();
        updatedUser.setUsername("artistTest");
        updatedUser.setEmail("updated@test.com");
        updatedUser.setName("Updated Name");

        mockMvc.perform(put("/api/v1/artists/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(updatedUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("updated@test.com"))
                .andExpect(jsonPath("$.name").value("Updated Name"));
    }
}
