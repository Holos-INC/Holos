package com.HolosINC.Holos.worksDone;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.artist.ArtistService;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.worksdone.WorksDone;
import com.HolosINC.Holos.worksdone.WorksDoneRepository;
import com.HolosINC.Holos.worksdone.WorksDoneService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import org.springframework.dao.DataAccessException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class WorksDoneServiceTest {

    @Mock
    private WorksDoneRepository worksDoneRepository;

    @Mock
    private ArtistService artistService;

    @InjectMocks
    private WorksDoneService worksDoneService;

    private WorksDone worksDone;
    private Artist artist;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        // Instancia básica para usar en los tests
        artist = new Artist();
        artist.setId(10L);

        worksDone = new WorksDone();
        worksDone.setId(1L);
        worksDone.setName("Obra de Prueba");
        worksDone.setArtist(artist);
    }

    // 1) createWorksDone
    @Test
    public void testCreateWorksDone_Success() throws Exception {
        when(worksDoneRepository.save(any(WorksDone.class))).thenReturn(worksDone);

        WorksDone result = worksDoneService.createWorksDone(worksDone);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Obra de Prueba", result.getName());
        verify(worksDoneRepository, times(1)).save(worksDone);
    }

    @Test
    public void testCreateWorksDone_DataAccessException() {
        when(worksDoneRepository.save(worksDone)).thenThrow(new DataAccessException("DB Error") {});

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
        when(artistService.findArtist(10L)).thenReturn(artist);
        when(worksDoneRepository.findById(1L)).thenReturn(Optional.of(worksDone));
        when(worksDoneRepository.save(any(WorksDone.class))).thenAnswer(inv -> inv.getArgument(0));

        // Nuevo WorksDone con cambios:
        WorksDone updatedData = new WorksDone();
        updatedData.setName("Obra Actualizada");
        // updatedData.setArtist(...)  // No lo seteamos porque no se sobreescribe en update

        WorksDone result = worksDoneService.updateWorksDone(updatedData, 1L, 10L);

        assertNotNull(result);
        assertEquals("Obra Actualizada", result.getName());
        // Verificar que no cambió el ID ni el Artist:
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
    public void testGetWorksDoneById_Success() {
        when(worksDoneRepository.findById(1L)).thenReturn(Optional.of(worksDone));

        WorksDone result = worksDoneService.getWorksDoneById(1L);

        assertNotNull(result);
        assertEquals("Obra de Prueba", result.getName());
        verify(worksDoneRepository, times(1)).findById(1L);
    }

    @Test
    public void testGetWorksDoneById_NotFound() {
        when(worksDoneRepository.findById(999L)).thenReturn(Optional.empty());

        WorksDone result = worksDoneService.getWorksDoneById(999L);
        assertNull(result);

        verify(worksDoneRepository, times(1)).findById(999L);
    }

    // 5) getWorksDoneByArtist
    @Test
    public void testGetWorksDoneByArtist_Success() {
        List<WorksDone> allWorks = new ArrayList<>();
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
}