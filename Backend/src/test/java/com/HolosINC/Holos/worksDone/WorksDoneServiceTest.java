package com.HolosINC.Holos.worksDone;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.artist.ArtistService;
import com.HolosINC.Holos.auth.Auth;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserService;
import com.HolosINC.Holos.worksdone.WorksDone;
import com.HolosINC.Holos.worksdone.WorksDoneRepository;
import com.HolosINC.Holos.worksdone.WorksDoneService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import org.springframework.dao.DataAccessException;

import java.nio.file.AccessDeniedException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

public class WorksDoneServiceTest {

    @Mock
    private WorksDoneRepository worksDoneRepository;

    @Mock
    private ArtistService artistService;

    @Mock
    private BaseUserService baseUserService;

    @InjectMocks
    private WorksDoneService worksDoneService;

    private WorksDone worksDone;
    private Artist artist;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);

        // Crear BaseUser con autoridad
        BaseUser baseUser = new BaseUser();
        baseUser.setId(10L);
        baseUser.setUsername("testuser");
        baseUser.setName("Test");
        baseUser.setAuthority(Auth.ARTIST_PREMIUM);

        // Crear artista con ese BaseUser
        artist = new Artist();
        artist.setId(10L);
        artist.setBaseUser(baseUser);

        // Crear obra con imagen y nombre
        worksDone = new WorksDone();
        worksDone.setId(1L);
        worksDone.setName("Obra de Prueba");
        worksDone.setImage("dummy image content".getBytes());
    }

    // 1) createWorksDone
    @Test
    public void testCreateWorksDone_Success() throws Exception {
        worksDone.setImage("dummy image content".getBytes());

        when(baseUserService.findCurrentUser()).thenReturn(artist.getBaseUser());
        when(baseUserService.findArtist(10L)).thenReturn(artist);
        when(worksDoneRepository.countByArtistId(10L)).thenReturn(0L);
        when(worksDoneRepository.save(any(WorksDone.class))).thenReturn(worksDone);

        WorksDone result = worksDoneService.createWorksDone(worksDone);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Obra de Prueba", result.getName());
        verify(worksDoneRepository, times(1)).save(worksDone);
    }

    @Test
    public void testCreateWorksDone_DataAccessException() {
        worksDone.setImage("dummy image content".getBytes());

        when(baseUserService.findCurrentUser()).thenReturn(artist.getBaseUser());
        when(baseUserService.findArtist(10L)).thenReturn(artist);
        when(worksDoneRepository.countByArtistId(10L)).thenReturn(0L);
        when(worksDoneRepository.save(worksDone)).thenThrow(new DataAccessException("DB Error") {
        });

        assertThrows(DataAccessException.class, () -> {
            worksDoneService.createWorksDone(worksDone);
        });

        verify(worksDoneRepository, times(1)).save(worksDone);
    }

    // 2) getAllWorksDone
    @Test
    public void testGetAllWorksDone_Success() {
        List<WorksDone> list = new ArrayList<>();
        list.add(worksDone);

        when(worksDoneRepository.findAll()).thenReturn(list);

        List<WorksDone> result = worksDoneService.getAllWorksDone();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Obra de Prueba", result.get(0).getName());
        verify(worksDoneRepository, times(1)).findAll();
    }

    // 3) updateWorksDone
    @Test
    public void testUpdateWorksDone_Success() throws Exception {
        // Setup
        worksDone.setArtist(artist);

        when(artistService.findArtist(10L)).thenReturn(artist);
        when(worksDoneRepository.findById(1L)).thenReturn(Optional.of(worksDone));
        when(worksDoneRepository.save(any(WorksDone.class))).thenAnswer(inv -> inv.getArgument(0));

        // Nuevo WorksDone con cambios:
        WorksDone updatedData = new WorksDone();
        updatedData.setName("Obra Actualizada");

        WorksDone result = worksDoneService.updateWorksDone(updatedData, 1L, 10L);

        assertNotNull(result);
        assertEquals("Obra Actualizada", result.getName());
        assertEquals(1L, result.getId());
        assertNotNull(result.getArtist());
        assertEquals(10L, result.getArtist().getId());

        verify(artistService, times(1)).findArtist(10L);
        verify(worksDoneRepository, times(1)).findById(1L);
        verify(worksDoneRepository, times(1)).save(any(WorksDone.class));
    }

    @Test
    public void testUpdateWorksDone_ArtistNotFound() throws Exception {
        // Escenario donde no se encuentra el artista
        when(artistService.findArtist(999L))
                .thenThrow(new ResourceNotFoundException("Artist", "id", 999L));

        WorksDone updatedData = new WorksDone();
        updatedData.setName("No importa");

        assertThrows(ResourceNotFoundException.class, () -> {
            worksDoneService.updateWorksDone(updatedData, 1L, 999L);
        });

        verify(artistService, times(1)).findArtist(999L);
        verify(worksDoneRepository, never()).findById(anyLong());
        verify(worksDoneRepository, never()).save(any());
    }

    @Test
    public void testUpdateWorksDone_WorksDoneNotFound() throws Exception {
        // El artista sí se encuentra, pero la obra no.
        when(artistService.findArtist(10L)).thenReturn(artist);
        when(worksDoneRepository.findById(999L)).thenReturn(Optional.empty());

        WorksDone updatedData = new WorksDone();
        updatedData.setName("No importa");

        assertThrows(ResourceNotFoundException.class, () -> {
            worksDoneService.updateWorksDone(updatedData, 999L, 10L);
        });

        verify(artistService, times(1)).findArtist(10L);
        verify(worksDoneRepository, times(1)).findById(999L);
        verify(worksDoneRepository, never()).save(any());
    }

    @Test
    public void testUpdateWorksDone_ArtistMismatch() throws Exception {
        // La obra pertenece a otro artista
        Artist otherArtist = new Artist();
        otherArtist.setId(20L);

        worksDone.setArtist(otherArtist);

        when(artistService.findArtist(10L)).thenReturn(artist);
        when(worksDoneRepository.findById(1L)).thenReturn(Optional.of(worksDone));

        WorksDone updatedData = new WorksDone();
        updatedData.setName("Nuevo título");

        assertThrows(IllegalArgumentException.class, () -> {
            worksDoneService.updateWorksDone(updatedData, 1L, 10L);
        });

        verify(artistService, times(1)).findArtist(10L);
        verify(worksDoneRepository, times(1)).findById(1L);
        verify(worksDoneRepository, never()).save(any());
    }

    // 4) getWorksDoneById
    @Test
    public void testGetWorksDoneById_Success() throws Exception {
        when(worksDoneRepository.findById(1L)).thenReturn(Optional.of(worksDone));

        WorksDone result = worksDoneService.getWorksDoneById(1L);

        assertNotNull(result);
        assertEquals("Obra de Prueba", result.getName());
        verify(worksDoneRepository, times(1)).findById(1L);
    }

    @Test
    public void testGetWorksDoneById_NotFound() throws Exception {
        when(worksDoneRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            worksDoneService.getWorksDoneById(999L);
        });

        verify(worksDoneRepository, times(1)).findById(999L);
    }

    // 5) getWorksDoneByArtist
    @Test
    public void testGetWorksDoneByArtist_Success() {
        List<WorksDone> allWorks = new ArrayList<>();

        worksDone.setArtist(artist);
        allWorks.add(worksDone);

        // Creamos una obra con otro artista
        Artist otherArtist = new Artist();
        otherArtist.setId(99L);

        WorksDone otherWork = new WorksDone();
        otherWork.setId(2L);
        otherWork.setName("Obra de Otro Artista");
        otherWork.setArtist(otherArtist);
        allWorks.add(otherWork);

        when(worksDoneRepository.findAll()).thenReturn(allWorks);

        List<WorksDone> result = worksDoneService.getWorksDoneByArtist(artist);

        assertEquals(1, result.size());
        assertEquals("Obra de Prueba", result.get(0).getName());
        verify(worksDoneRepository, times(1)).findAll();
    }

    @Test
    public void testGetWorksDoneByArtist_EmptyList() {
        // No hay obras en la base
        when(worksDoneRepository.findAll()).thenReturn(new ArrayList<>());

        List<WorksDone> result = worksDoneService.getWorksDoneByArtist(artist);

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(worksDoneRepository, times(1)).findAll();
    }

    // 6) countByArtistId
    @Test
    public void testCountByArtistId_Success() {
        when(worksDoneRepository.countByArtistId(10L)).thenReturn(5L);

        Long count = worksDoneService.countByArtistId(10L);

        assertEquals(5L, count);
        verify(worksDoneRepository, times(1)).countByArtistId(10L);
    }

    @Test
    public void testDeleteWorksDone_Success() throws Exception {
        worksDone.setArtist(artist);

        when(worksDoneRepository.findById(1L)).thenReturn(Optional.of(worksDone));
        when(baseUserService.findCurrentUser()).thenReturn(artist.getBaseUser());

        worksDoneService.deleteWorksDone(1L);

        verify(worksDoneRepository, times(1)).delete(worksDone);
    }
}