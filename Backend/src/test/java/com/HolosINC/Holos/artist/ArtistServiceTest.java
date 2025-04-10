package com.HolosINC.Holos.artist;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.dao.DataAccessException;

import com.HolosINC.Holos.Category.ArtistCategoryRepository;
import com.HolosINC.Holos.Kanban.StatusKanbanOrderService;
import com.HolosINC.Holos.commision.Commision;
import com.HolosINC.Holos.commision.CommisionRepository;
import com.HolosINC.Holos.commision.StatusCommision;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserRepository;

public class ArtistServiceTest {

    @Mock
    private ArtistRepository artistRepository;

    @Mock
    private BaseUserRepository baseUserRepository;

    @Mock
    private CommisionRepository commisionRepository;

    @Mock
    private StatusKanbanOrderService statusKanbanOrderService;

    @Mock
    private ArtistCategoryRepository artistCategoryRepository;

    @InjectMocks
    private ArtistService artistService;

    private Artist artist;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        artist = new Artist();
        artist.setId(1L);
        artist.setBaseUser(new BaseUser());
        artist.getBaseUser().setId(1L);
    }

    @Test
    public void testSaveArtistSuccess() {
        when(artistRepository.save(artist)).thenReturn(artist);

        Artist savedArtist = artistService.saveArtist(artist);

        assertNotNull(savedArtist);
        assertEquals(artist.getId(), savedArtist.getId());
        verify(artistRepository, times(1)).save(artist);
    }

    @Test
    public void testSaveArtistFailure() {
        when(artistRepository.save(artist)).thenThrow(new DataAccessException("Error saving artist") {});

        assertThrows(DataAccessException.class, () -> {
            artistService.saveArtist(artist);
        });

        verify(artistRepository, times(1)).save(artist);
    }

    @Test
    public void testFindArtistByIdSuccess() throws Exception{
        when(artistRepository.findById(1L)).thenReturn(Optional.of(artist));

        Artist foundArtist = artistService.findArtist(1L);

        assertNotNull(foundArtist);
        assertEquals(artist.getId(), foundArtist.getId());
        verify(artistRepository, times(1)).findById(1L);
    }

    @Test
    public void testFindArtistByIdNotFound() {
        when(artistRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            artistService.findArtist(1L);
        });

        verify(artistRepository, times(1)).findById(1L);
    }

    @Test
    public void testFindArtistByUsernameSuccess() throws Exception {
        when(artistRepository.findByUsername("artistUsername")).thenReturn(Optional.of(artist));

        Artist foundArtist = artistService.findArtistByUsername("artistUsername");

        assertNotNull(foundArtist);
        assertEquals(artist.getId(), foundArtist.getId());
        verify(artistRepository, times(1)).findByUsername("artistUsername");
    }

    @Test
    public void testFindArtistByUsernameNotFound() {
        when(artistRepository.findByUsername("artistUsername")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            artistService.findArtistByUsername("artistUsername");
        });

        verify(artistRepository, times(1)).findByUsername("artistUsername");
    }

    @Test
    public void testIsArtistTrue() throws Exception{
        when(artistRepository.findByUserId(1L)).thenReturn(Optional.of(artist));

        boolean isArtist = artistService.isArtist(1L);

        assertTrue(isArtist);
        verify(artistRepository, times(1)).findByUserId(1L);
    }

    @Test
    public void testIsArtistFalse() throws Exception{
        when(artistRepository.findByUserId(1L)).thenReturn(Optional.empty());

        boolean isArtist = artistService.isArtist(1L);

        assertFalse(isArtist);
        verify(artistRepository, times(1)).findByUserId(1L);
    }

    @Test
    public void testDeleteArtistSuccess() throws Exception {
        when(artistRepository.findArtistByUser(1L)).thenReturn(Optional.of(artist));
        when(commisionRepository.findAll()).thenReturn(Collections.emptyList());
        when(statusKanbanOrderService.findAllStatusKanbanOrderByArtist(1L)).thenReturn(Collections.emptyList());
        when(artistCategoryRepository.findAllByArtistId(1L)).thenReturn(Collections.emptyList());

        artistService.deleteArtist(1L);

        verify(artistRepository, times(1)).delete(artist);
        verify(baseUserRepository, times(1)).deleteById(1L);
    }

    @Test
    public void testDeleteArtistWithAcceptedCommissions() {
        Commision commision = new Commision();
        commision.setArtist(artist);
        commision.setStatus(StatusCommision.ACCEPTED);

        when(artistRepository.findArtistByUser(1L)).thenReturn(Optional.of(artist));
        when(commisionRepository.findAll()).thenReturn(List.of(commision));

        assertThrows(RuntimeException.class, () -> {
            artistService.deleteArtist(1L);
        });

        verify(artistRepository, never()).delete(any(Artist.class));
    }

    @Test
    public void testDeleteArtistNotFound() {
        when(artistRepository.findArtistByUser(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            artistService.deleteArtist(1L);
        });

        verify(artistRepository, never()).delete(any(Artist.class));
    }

    @Test
    public void testFindByBaseUserIdSuccess() throws Exception{
        when(artistRepository.findByUserId(1L)).thenReturn(Optional.of(artist));

        Optional<Artist> foundArtist = artistService.findByBaseUserId(1L);

        assertTrue(foundArtist.isPresent());
        assertEquals(artist.getId(), foundArtist.get().getId());
        verify(artistRepository, times(1)).findByUserId(1L);
    }

    @Test
    public void testFindByBaseUserIdNotFound() throws Exception{
        when(artistRepository.findByUserId(1L)).thenReturn(Optional.empty());

        Optional<Artist> foundArtist = artistService.findByBaseUserId(1L);

        assertFalse(foundArtist.isPresent());
        verify(artistRepository, times(1)).findByUserId(1L);
    }
}
