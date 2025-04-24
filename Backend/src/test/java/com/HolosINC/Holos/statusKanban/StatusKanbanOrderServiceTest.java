package com.HolosINC.Holos.statusKanban;

import com.HolosINC.Holos.Kanban.StatusKanbanOrder;
import com.HolosINC.Holos.Kanban.StatusKanbanOrderRepository;
import com.HolosINC.Holos.Kanban.StatusKanbanOrderService;
import com.HolosINC.Holos.Kanban.DTOs.*;
import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.artist.ArtistService;
import com.HolosINC.Holos.commision.*;
import com.HolosINC.Holos.exceptions.BadRequestException;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.exceptions.ResourceNotOwnedException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;

import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.BeanUtils;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

public class StatusKanbanOrderServiceTest {

    @Mock
    private StatusKanbanOrderRepository statusKanbanOrderRepository;

    @Mock
    private CommisionRepository commisionRepository;

    @Mock
    private ArtistService artistService;

    @Mock
    private BaseUserService userService;

    @Mock
    private CommisionService commisionService;

    @InjectMocks
    private StatusKanbanOrderService statusKanbanOrderService;

    private Artist artist;
    private BaseUser currentUser;
    private StatusKanbanOrder statusKanbanOrder;
    private StatusKanbanCreateDTO createDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Datos básicos para usar en los tests
        currentUser = new BaseUser();
        currentUser.setId(100L);

        artist = new Artist();
        artist.setId(10L);
        artist.setBaseUser(currentUser);

        statusKanbanOrder = new StatusKanbanOrder();
        statusKanbanOrder.setId(1L);
        statusKanbanOrder.setName("Boceto");
        statusKanbanOrder.setOrder(1);
        statusKanbanOrder.setArtist(artist);

        createDTO = new StatusKanbanCreateDTO();
        createDTO.setName("NuevoEstado");
    }

    // ============================================================
    // 1) addStatusToKanban(StatusKanbanCreateDTO dto)
    // ============================================================
    @Test
    public void testAddStatusToKanban_Success() throws Exception {
        when(userService.findCurrentUser()).thenReturn(currentUser);
        when(artistService.findArtistByUserId(100L)).thenReturn(artist);
        // Supongamos que countByArtistUsername retorna cuántos estados hay
        when(statusKanbanOrderRepository.countByArtistUsername(currentUser.getUsername())).thenReturn(2);
        when(statusKanbanOrderRepository.save(any(StatusKanbanOrder.class))).thenAnswer(i -> {
            StatusKanbanOrder saved = i.getArgument(0);
            saved.setId(99L); // Simulamos que se le asigna ID
            return saved;
        });

        StatusKanbanOrder result = statusKanbanOrderService.addStatusToKanban(createDTO);

        assertNotNull(result);
        assertEquals("NuevoEstado", result.getName());
        assertEquals(3, result.getOrder()); // Se espera 2 + 1
        assertEquals(artist, result.getArtist());
        assertEquals(99, result.getId());

        verify(statusKanbanOrderRepository, times(1)).save(any(StatusKanbanOrder.class));
    }

    @Test
    public void testAddStatusToKanban_DataIntegrityViolation() throws Exception {
        when(userService.findCurrentUser()).thenReturn(currentUser);
        when(artistService.findArtistByUserId(any(Long.class))).thenReturn(artist);
        when(statusKanbanOrderRepository.countByArtistUsername(anyString())).thenReturn(0);
        when(statusKanbanOrderRepository.save(any(StatusKanbanOrder.class)))
                .thenThrow(new DataIntegrityViolationException("Duplicado"));

        assertThrows(BadRequestException.class, () -> {
            statusKanbanOrderService.addStatusToKanban(createDTO);
        });
    }

    // ============================================================
    // 2) updateStatusKanban(StatusKanbanUpdateDTO dto)
    // ============================================================
    @Test
    public void testUpdateStatusKanban_Success() {
        StatusKanbanUpdateDTO updateDTO = new StatusKanbanUpdateDTO();
        updateDTO.setId(1L);
        updateDTO.setName("Estado Editado");

        when(statusKanbanOrderRepository.findById(1)).thenReturn(Optional.of(statusKanbanOrder));
        // No está en uso => false
        when(commisionService.isStatusKanbanInUse(statusKanbanOrder)).thenReturn(false);

        statusKanbanOrderService.updateStatusKanban(updateDTO);

        assertEquals("Estado Editado", statusKanbanOrder.getName());
        assertEquals(1, statusKanbanOrder.getOrder());
        verify(statusKanbanOrderRepository, times(1)).save(statusKanbanOrder);
    }

    @Test
    public void testUpdateStatusKanban_ResourceNotFound() {
        StatusKanbanUpdateDTO updateDTO = new StatusKanbanUpdateDTO();
        updateDTO.setId(999L);

        when(statusKanbanOrderRepository.findById(999)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            statusKanbanOrderService.updateStatusKanban(updateDTO);
        });
    }

    @Test
    public void testUpdateStatusKanban_StatusInUse() {
        StatusKanbanUpdateDTO updateDTO = new StatusKanbanUpdateDTO();
        updateDTO.setId(1L);
        updateDTO.setName("Progreso");

        when(statusKanbanOrderRepository.findById(1)).thenReturn(Optional.of(statusKanbanOrder));
        // Simulamos que está en uso
        when(commisionService.isStatusKanbanInUse(statusKanbanOrder)).thenReturn(true);

        assertThrows(BadRequestException.class, () -> {
            statusKanbanOrderService.updateStatusKanban(updateDTO);
        });

        // No se llama a save
        verify(statusKanbanOrderRepository, never()).save(any());
    }

    @Test
    public void testUpdateStatusKanban_DataIntegrityViolation() {
        StatusKanbanUpdateDTO updateDTO = new StatusKanbanUpdateDTO();
        updateDTO.setId(1L);
        updateDTO.setName("X");

        when(statusKanbanOrderRepository.findById(1)).thenReturn(Optional.of(statusKanbanOrder));
        when(commisionService.isStatusKanbanInUse(statusKanbanOrder)).thenReturn(false);
        when(statusKanbanOrderRepository.save(any(StatusKanbanOrder.class)))
                .thenThrow(new DataIntegrityViolationException("Duplicado"));

        assertThrows(BadRequestException.class, () -> {
            statusKanbanOrderService.updateStatusKanban(updateDTO);
        });
    }

    // ============================================================
    // 3) getStatusKanbanById(Integer id)
    // ============================================================
    @Test
    public void testGetStatusKanbanById_Success() {
        when(statusKanbanOrderRepository.findById(1)).thenReturn(Optional.of(statusKanbanOrder));

        StatusKanbanDTO dto = statusKanbanOrderService.getStatusKanbanById(1);

        assertNotNull(dto);
        assertEquals("Boceto", dto.getName());
        assertEquals(1, dto.getOrder());
    }

    @Test
    public void testGetStatusKanbanById_NotFound() {
        when(statusKanbanOrderRepository.findById(999)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            statusKanbanOrderService.getStatusKanbanById(999);
        });
    }

    // ============================================================
    // 4) deleteStatusKanbanOrder(Integer id)
    // ============================================================
    @Test
    public void testDeleteStatusKanbanOrder_Success() {
        when(statusKanbanOrderRepository.findById(1)).thenReturn(Optional.of(statusKanbanOrder));
        // No está en uso => false
        when(commisionService.isStatusKanbanInUse(statusKanbanOrder)).thenReturn(false);

        // No error al eliminar
        doNothing().when(statusKanbanOrderRepository).deleteById(1);

        // Supongamos que no hay otros status => list vacía
        when(statusKanbanOrderRepository.findByArtistIdOrderByOrderAscFiltered(artist.getId(), statusKanbanOrder.getOrder()))
                .thenReturn(Collections.emptyList());

        statusKanbanOrderService.deleteStatusKanbanOrder(1);

        verify(statusKanbanOrderRepository, times(1)).deleteById(1);
        verify(statusKanbanOrderRepository, times(2)).flush();
    }

    @Test
    public void testDeleteStatusKanbanOrder_NotFound() {
        when(statusKanbanOrderRepository.findById(999)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            statusKanbanOrderService.deleteStatusKanbanOrder(999);
        });

        verify(statusKanbanOrderRepository, never()).deleteById(anyInt());
    }

    @Test
    public void testDeleteStatusKanbanOrder_StatusInUse() {
        when(statusKanbanOrderRepository.findById(1)).thenReturn(Optional.of(statusKanbanOrder));
        when(commisionService.isStatusKanbanInUse(statusKanbanOrder)).thenReturn(true);

        assertThrows(BadRequestException.class, () -> {
            statusKanbanOrderService.deleteStatusKanbanOrder(1);
        });

        verify(statusKanbanOrderRepository, never()).deleteById(anyInt());
    }

    // ============================================================
    // 5) getAllStatusFromArtist()
    // ============================================================
    @Test
    public void testGetAllStatusFromArtist_Success() {
        when(userService.findCurrentUser()).thenReturn(currentUser);
        // Se asume que artistService.findArtistByUserId(...) no se llama,
        // porque en el método hay un find, pero revisa tu código real.
        // El ID 100 es BaseUser, no Artist, cuidado. Revisa si tu método
        // usa el userId o el ArtistId. Asumimos que se hace por userId.
        // No se ve en tu método un findArtistByUserId, sino un getAllStatusOrdererOfArtist(artistId).
        // Asumimos que userId es el "artistId" en tu repos, adáptalo si no es así.

        List<StatusKanbanDTO> statuses = List.of(new StatusKanbanDTO(statusKanbanOrder));
        StatusKanbanWithCommisionsDTO commisionsDTO = new StatusKanbanWithCommisionsDTO(55L,"Boceto","Algo",3.,EnumPaymentArrangement.INITIAL,"Prueba","client1");
        List<StatusKanbanWithCommisionsDTO> commisions = List.of(commisionsDTO);

        when(statusKanbanOrderRepository.getAllStatusOrdererOfArtist(100L)).thenReturn(statuses);
        when(statusKanbanOrderRepository.getAllCommisionsAcceptedOfArtist(100L)).thenReturn(commisions);

        StatusKanbanFullResponseDTO result = statusKanbanOrderService.getAllStatusFromArtist();

        assertNotNull(result);
        assertEquals(1, result.getStatuses().size());
        assertEquals("Boceto", result.getStatuses().get(0).getName());
        assertEquals(1, result.getCommissions().size());
        assertEquals(55L, result.getCommissions().get(0).getId());
    }

    // ============================================================
    // 6) countByArtistUsername(String username)
    // ============================================================
    @Test
    public void testCountByArtistUsername_Success() {
        when(statusKanbanOrderRepository.countByArtistUsername("someUsername")).thenReturn(5);

        Integer result = statusKanbanOrderService.countByArtistUsername("someUsername");

        assertEquals(5, result);
    }

    // ============================================================
    // 7) findAllStatusKanbanOrderByArtist(Long intValue)
    // ============================================================
    @Test
    public void testFindAllStatusKanbanOrderByArtist_Success() {
        when(statusKanbanOrderRepository.findByArtistIdOrderByOrderAsc(10L))
                .thenReturn(List.of(statusKanbanOrder));

        List<StatusKanbanOrder> result = statusKanbanOrderService.findAllStatusKanbanOrderByArtist(10L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Boceto", result.get(0).getName());
    }

    // ============================================================
    // 8) nextStatusOfCommision(Long id)
    // ============================================================
    @Test
    public void testNextStatusOfCommision_Success() throws Exception {
        Commision c = new Commision();
        c.setId(777L);
        c.setArtist(artist);

        when(userService.findCurrentUser()).thenReturn(currentUser);
        when(artistService.findArtistByUserId(100L)).thenReturn(artist);
        when(commisionRepository.findById(777L)).thenReturn(Optional.of(c));
        // Suponemos que la comisión ya está en un "thisStatus"
        when(statusKanbanOrderRepository.actualStatusKanban(777L)).thenReturn(statusKanbanOrder);

        StatusKanbanOrder nextStatus = new StatusKanbanOrder();
        nextStatus.setId(2L);
        nextStatus.setOrder(2);
        nextStatus.setArtist(artist);

        when(statusKanbanOrderRepository.statusKanbanOfOrder(artist.getId(), 2))
                .thenReturn(Optional.of(nextStatus));

        statusKanbanOrderService.nextStatusOfCommision(777L);

        // Se asigna la comision al nextStatus
        assertEquals(nextStatus, c.getStatusKanbanOrder());
        assertNull(c.getStatus()); // no se setea a ENDED al tener nextStatus

        verify(commisionRepository, times(1)).save(c);
    }

    @Test
    public void testNextStatusOfCommision_NoNextStatus() throws Exception {
        Commision c = new Commision();
        c.setId(777L);
        c.setArtist(artist);
        c.setStatusKanbanOrder(statusKanbanOrder);

        when(userService.findCurrentUser()).thenReturn(currentUser);
        when(artistService.findArtistByUserId(100L)).thenReturn(artist);
        when(commisionRepository.findById(777L)).thenReturn(Optional.of(c));
        when(statusKanbanOrderRepository.actualStatusKanban(777L)).thenReturn(statusKanbanOrder);
        // No hay estado de orden+1
        when(statusKanbanOrderRepository.statusKanbanOfOrder(artist.getId(), 2))
                .thenReturn(Optional.empty());

        statusKanbanOrderService.nextStatusOfCommision(777L);

        assertNull(c.getStatusKanbanOrder());
        // Se setea la comisión a ENDED
        assertEquals(StatusCommision.ENDED, c.getStatus());
        verify(commisionRepository, times(1)).save(c);
    }

    @Test
    public void testNextStatusOfCommision_NotFoundCommision() throws Exception {
        when(userService.findCurrentUser()).thenReturn(currentUser);
        when(artistService.findArtistByUserId(100L)).thenReturn(artist);
        when(commisionRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            statusKanbanOrderService.nextStatusOfCommision(999L);
        });
    }

    @Test
    public void testNextStatusOfCommision_NotOwned() throws Exception {
        // Escenario: comisión pertenece a otro artista
        Artist otherArtist = new Artist();
        otherArtist.setId(99L);

        Commision c = new Commision();
        c.setId(777L);
        c.setArtist(otherArtist);

        when(userService.findCurrentUser()).thenReturn(currentUser);
        when(artistService.findArtistByUserId(100L)).thenReturn(artist);
        when(commisionRepository.findById(777L)).thenReturn(Optional.of(c));

        assertThrows(ResourceNotOwnedException.class, () -> {
            statusKanbanOrderService.nextStatusOfCommision(777L);
        });
    }

    @Test
    public void testNextStatusOfCommision_NoActualStatus() throws Exception {
        Commision c = new Commision();
        c.setId(777L);
        c.setArtist(artist);

        when(userService.findCurrentUser()).thenReturn(currentUser);
        when(artistService.findArtistByUserId(100L)).thenReturn(artist);
        when(commisionRepository.findById(777L)).thenReturn(Optional.of(c));
        when(statusKanbanOrderRepository.actualStatusKanban(777L)).thenReturn(null);

        assertThrows(ResourceNotFoundException.class, () -> {
            statusKanbanOrderService.nextStatusOfCommision(777L);
        });
    }

    // ============================================================
    // 9) previousStatusOfCommision(Long id)
    // ============================================================
    @Test
    public void testPreviousStatusOfCommision_Success() throws Exception {
        Commision c = new Commision();
        c.setId(888L);
        c.setArtist(artist);

        StatusKanbanOrder currentStatus = new StatusKanbanOrder();
        currentStatus.setOrder(2); // Está en la orden 2
        c.setStatusKanbanOrder(currentStatus);

        StatusKanbanOrder prevStatus = new StatusKanbanOrder();
        prevStatus.setOrder(1);

        when(userService.findCurrentUser()).thenReturn(currentUser);
        when(artistService.findArtistByUserId(100L)).thenReturn(artist);
        when(commisionRepository.findById(888L)).thenReturn(Optional.of(c));
        when(statusKanbanOrderRepository.statusKanbanOfOrder(artist.getId(), 1))
                .thenReturn(Optional.of(prevStatus));

        statusKanbanOrderService.previousStatusOfCommision(888L);

        assertEquals(prevStatus, c.getStatusKanbanOrder());
        verify(commisionRepository, times(1)).save(c);
    }

    @Test
    public void testPreviousStatusOfCommision_NotFound() throws Exception {
        when(userService.findCurrentUser()).thenReturn(currentUser);
        when(artistService.findArtistByUserId(anyLong())).thenReturn(artist);

        assertThrows(ResourceNotFoundException.class, () -> {
            statusKanbanOrderService.previousStatusOfCommision(999L);
        });
    }

    @Test
    public void testPreviousStatusOfCommision_NotOwned() throws Exception {
        Artist otherArtist = new Artist();
        otherArtist.setId(101L);

        Commision c = new Commision();
        c.setId(888L);
        c.setArtist(otherArtist);

        when(userService.findCurrentUser()).thenReturn(currentUser);
        when(artistService.findArtistByUserId(100L)).thenReturn(artist);
        when(commisionRepository.findById(888L)).thenReturn(Optional.of(c));

        assertThrows(ResourceNotOwnedException.class, () -> {
            statusKanbanOrderService.previousStatusOfCommision(888L);
        });
    }

    @Test
    public void testPreviousStatusOfCommision_NoPreviousStatus() throws Exception {
        Commision c = new Commision();
        c.setId(888L);
        c.setArtist(artist);

        StatusKanbanOrder currentStatus = new StatusKanbanOrder();
        currentStatus.setOrder(1);
        c.setStatusKanbanOrder(currentStatus);

        when(userService.findCurrentUser()).thenReturn(currentUser);
        when(artistService.findArtistByUserId(100L)).thenReturn(artist);
        when(commisionRepository.findById(888L)).thenReturn(Optional.of(c));
        when(statusKanbanOrderRepository.statusKanbanOfOrder(artist.getId(), 0))
                .thenReturn(Optional.empty());

        assertThrows(BadRequestException.class, () -> {
            statusKanbanOrderService.previousStatusOfCommision(888L);
        });
    }

    // ============================================================
    // 10) reorderStatuses(List<Long> orderedIds)
    // ============================================================
    @Test
    public void testReorderStatuses_Success() throws Exception {
        List<Long> orderedIds = List.of(11L, 12L, 13L);

        when(userService.findCurrentUser()).thenReturn(currentUser);
        when(artistService.findArtistByUserId(100L)).thenReturn(artist);

        StatusKanbanOrder s1 = new StatusKanbanOrder();
        s1.setId(11L);
        s1.setOrder(1);
        s1.setArtist(artist);

        StatusKanbanOrder s2 = new StatusKanbanOrder();
        s2.setId(12L);
        s2.setOrder(2);
        s2.setArtist(artist);

        StatusKanbanOrder s3 = new StatusKanbanOrder();
        s3.setId(13L);
        s3.setOrder(3);
        s3.setArtist(artist);

        List<StatusKanbanOrder> allStatuses = List.of(s1, s2, s3);
        when(statusKanbanOrderRepository.findByArtistIdOrderByOrderAsc(10L)).thenReturn(allStatuses);

        statusKanbanOrderService.reorderStatuses(orderedIds);

        // Verificamos que se hizo invertido (setOrder(-order)) y luego setear nuevo order
        // Llamadas a saveAll(...) no se mockean con doNothing() => si no hay error, ok
        verify(statusKanbanOrderRepository, times(2)).saveAll(anyList());
        verify(statusKanbanOrderRepository, times(1)).flush();

        // Check final: s1 -> order 1, s2 -> order 2, s3 -> order 3 (coinciden con la lista)
        assertEquals(1, s1.getOrder());
        assertEquals(2, s2.getOrder());
        assertEquals(3, s3.getOrder());
    }

    @Test
    public void testReorderStatuses_EmptyList() {
        assertThrows(BadRequestException.class, () -> {
            statusKanbanOrderService.reorderStatuses(Collections.emptyList());
        });

        verify(statusKanbanOrderRepository, never()).findByArtistIdOrderByOrderAsc(anyLong());
    }

    @Test
    public void testReorderStatuses_DuplicatedIds() {
        List<Long> orderedIds = List.of(11L, 11L, 12L);

        assertThrows(BadRequestException.class, () -> {
            statusKanbanOrderService.reorderStatuses(orderedIds);
        });
    }

    @Test
    public void testReorderStatuses_StatusNotOwned() throws Exception {
        List<Long> orderedIds = List.of(11L);

        when(userService.findCurrentUser()).thenReturn(currentUser);
        when(artistService.findArtistByUserId(100L)).thenReturn(artist);

        StatusKanbanOrder foreignStatus = new StatusKanbanOrder();
        foreignStatus.setId(99L);
        foreignStatus.setArtist(new Artist());

        when(statusKanbanOrderRepository.findByArtistIdOrderByOrderAsc(10L)).thenReturn(List.of(foreignStatus));

        assertThrows(BadRequestException.class, () -> {
            statusKanbanOrderService.reorderStatuses(orderedIds);
        });
    }
    @Test
    public void testGetStatusKanbanById_NullId() {
        // Simulamos que el método findById no debe ser llamado con un ID nulo.
        assertThrows(IllegalArgumentException.class, () -> {
            statusKanbanOrderService.getStatusKanbanById(null);
        });
    }
    @Test
public void testDeleteStatusKanbanOrder_WithCommissions() {
    // Mock de la situación donde hay comisiones asociadas al estado Kanban.
    when(statusKanbanOrderRepository.findById(1)).thenReturn(Optional.of(statusKanbanOrder));
    when(commisionService.isStatusKanbanInUse(statusKanbanOrder)).thenReturn(true);

    // Lanza una excepción si se intenta eliminar un estado con comisiones asociadas.
    assertThrows(BadRequestException.class, () -> {
        statusKanbanOrderService.deleteStatusKanbanOrder(1);
    });

    // Verifica que el deleteById no se llame si hay comisiones.
    verify(statusKanbanOrderRepository, never()).deleteById(anyInt());
}
@Test
public void testAddStatusToKanban_EmptyName() {
    createDTO.setName("");  // Establecemos el nombre vacío

    // Simulamos que el método lanza una excepción si el nombre está vacío
    assertThrows(BadRequestException.class, () -> {
        statusKanbanOrderService.addStatusToKanban(createDTO);
    });

    // Verifica que el método save no se haya llamado
    verify(statusKanbanOrderRepository, never()).save(any(StatusKanbanOrder.class));
}
@Test
public void testAddStatusToKanban_ArtistWithoutPermission() throws Exception {
    // Simulamos que el artista no tiene los permisos necesarios
    when(userService.findCurrentUser()).thenReturn(currentUser);
    when(artistService.findArtistByUserId(100L)).thenReturn(null);  // El artista no existe

    // Lanza una excepción porque el artista no tiene permisos
    assertThrows(IllegalArgumentException.class, () -> {
        statusKanbanOrderService.addStatusToKanban(createDTO);
    });

    // Verifica que el método save no se haya llamado
    verify(statusKanbanOrderRepository, never()).save(any(StatusKanbanOrder.class));
}
@Test
public void testUpdateStatusKanban_InvalidName() {
    // Creamos un DTO con nombre vacío
    StatusKanbanUpdateDTO updateDTO = new StatusKanbanUpdateDTO();
    updateDTO.setId(1L);
    updateDTO.setName("");  // Nombre vacío

    when(statusKanbanOrderRepository.findById(1)).thenReturn(Optional.of(statusKanbanOrder));

    // Verifica que se lanza una excepción cuando el nombre es inválido
    assertThrows(IllegalArgumentException.class, () -> {
        statusKanbanOrderService.updateStatusKanban(updateDTO);
    });

    // Verifica que el método save no se haya llamado
    verify(statusKanbanOrderRepository, never()).save(any(StatusKanbanOrder.class));
}
@Test
public void testGetAllStatusFromArtist_NoStatuses() {
    when(userService.findCurrentUser()).thenReturn(currentUser);
    when(statusKanbanOrderRepository.getAllStatusOrdererOfArtist(currentUser.getId())).thenReturn(Collections.emptyList());

    // Se asume que no hay estados Kanban, por lo que la lista debe estar vacía
    StatusKanbanFullResponseDTO result = statusKanbanOrderService.getAllStatusFromArtist();

    assertNotNull(result);
    assertEquals(0, result.getStatuses().size());
}
@Test
public void testAdvanceCommisionToNextStatus_LastStatus() throws Exception {
    Commision c = new Commision();
    c.setId(777L);
    c.setArtist(artist);

    StatusKanbanOrder lastStatus = new StatusKanbanOrder();
    lastStatus.setOrder(99);  // El último estado tiene el orden 99
    c.setStatusKanbanOrder(lastStatus);

    when(commisionRepository.findById(777L)).thenReturn(Optional.of(c));
    when(statusKanbanOrderRepository.actualStatusKanban(777L)).thenReturn(lastStatus);
    when(statusKanbanOrderRepository.statusKanbanOfOrder(artist.getId(), 100)).thenReturn(Optional.empty());  // No hay siguiente

    // Se verifica que la comisión no avance y se establezca como ENDED
    statusKanbanOrderService.nextStatusOfCommision(777L);

    assertEquals(StatusCommision.ENDED, c.getStatus());
    verify(commisionRepository, times(1)).save(c);
}
@Test
public void testNextStatusOfCommision_Canceled() throws Exception {
    Commision c = new Commision();
    c.setId(777L);
    c.setArtist(artist);
    c.setStatus(StatusCommision.CANCELED);  // Comisión ya cancelada

    when(commisionRepository.findById(777L)).thenReturn(Optional.of(c));

    // Verifica que se lanza una excepción porque la comisión no puede avanzar al siguiente estado si está cancelada
    assertThrows(IllegalStateException.class, () -> {
        statusKanbanOrderService.nextStatusOfCommision(777L);
    });

    // Verifica que el estado de la comisión no cambió
    assertEquals(StatusCommision.CANCELED, c.getStatus());
}
@Test
public void testReorderStatuses_NotOwned() throws Exception {
    List<Long> orderedIds = List.of(11L, 12L, 13L);

    when(userService.findCurrentUser()).thenReturn(currentUser);
    when(artistService.findArtistByUserId(100L)).thenReturn(artist);

    StatusKanbanOrder foreignStatus = new StatusKanbanOrder();
    foreignStatus.setId(99L);
    foreignStatus.setArtist(new Artist());  // Estado de otro artista

    when(statusKanbanOrderRepository.findByArtistIdOrderByOrderAsc(10L)).thenReturn(List.of(foreignStatus));

    assertThrows(BadRequestException.class, () -> {
        statusKanbanOrderService.reorderStatuses(orderedIds);
    });
}

}