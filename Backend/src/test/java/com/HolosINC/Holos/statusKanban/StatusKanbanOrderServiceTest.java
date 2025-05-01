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
import org.mockito.*;

import org.springframework.dao.DataIntegrityViolationException;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
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

        when(statusKanbanOrderRepository.findById(1L)).thenReturn(Optional.of(statusKanbanOrder));
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

        when(statusKanbanOrderRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            statusKanbanOrderService.updateStatusKanban(updateDTO);
        });
    }

    @Test
    public void testUpdateStatusKanban_StatusInUse() {
        StatusKanbanUpdateDTO updateDTO = new StatusKanbanUpdateDTO();
        updateDTO.setId(1L);
        updateDTO.setName("Progreso");

        when(statusKanbanOrderRepository.findById(1L)).thenReturn(Optional.of(statusKanbanOrder));
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

        when(statusKanbanOrderRepository.findById(1L)).thenReturn(Optional.of(statusKanbanOrder));
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
        when(statusKanbanOrderRepository.findById(1L)).thenReturn(Optional.of(statusKanbanOrder));

        StatusKanbanDTO dto = statusKanbanOrderService.getStatusKanbanById(1L);

        assertNotNull(dto);
        assertEquals("Boceto", dto.getName());
        assertEquals(1, dto.getOrder());
    }

    @Test
    public void testGetStatusKanbanById_NotFound() {
        when(statusKanbanOrderRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            statusKanbanOrderService.getStatusKanbanById(999L);
        });
    }

    // ============================================================
    // 4) deleteStatusKanbanOrder(Integer id)
    // ============================================================
    @Test
    public void testDeleteStatusKanbanOrder_Success() {
        when(statusKanbanOrderRepository.findById(1L)).thenReturn(Optional.of(statusKanbanOrder));
        // No está en uso => false
        when(commisionService.isStatusKanbanInUse(statusKanbanOrder)).thenReturn(false);

        // No error al eliminar
        doNothing().when(statusKanbanOrderRepository).deleteById(1L);

        // Supongamos que no hay otros status => list vacía
        when(statusKanbanOrderRepository.findByArtistIdOrderByOrderAscFiltered(artist.getId(), statusKanbanOrder.getOrder()))
                .thenReturn(Collections.emptyList());

        statusKanbanOrderService.deleteStatusKanbanOrder(1L);

        verify(statusKanbanOrderRepository, times(1)).deleteById(1L);
        verify(statusKanbanOrderRepository, times(2)).flush();
    }

    @Test
    public void testDeleteStatusKanbanOrder_NotFound() {
        when(statusKanbanOrderRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            statusKanbanOrderService.deleteStatusKanbanOrder(999L);
        });

        verify(statusKanbanOrderRepository, never()).deleteById(anyLong());
    }

    @Test
    public void testDeleteStatusKanbanOrder_StatusInUse() {
        when(statusKanbanOrderRepository.findById(1L)).thenReturn(Optional.of(statusKanbanOrder));
        when(commisionService.isStatusKanbanInUse(statusKanbanOrder)).thenReturn(true);

        assertThrows(BadRequestException.class, () -> {
            statusKanbanOrderService.deleteStatusKanbanOrder(1L);
        });

        verify(statusKanbanOrderRepository, never()).deleteById(anyLong());
    }

    // ============================================================
    // 5) getAllStatusFromArtist()
    // ============================================================
    /*@Test
    public void testGetAllStatusFromArtist_Success() throws Exception {
        when(userService.findCurrentUser()).thenReturn(currentUser);
        // Se asume que artistService.findArtistByUserId(...) no se llama,
        // porque en el método hay un find, pero revisa tu código real.
        // El ID 100 es BaseUser, no Artist, cuidado. Revisa si tu método
        // usa el userId o el ArtistId. Asumimos que se hace por userId.
        // No se ve en tu método un findArtistByUserId, sino un getAllStatusOrdererOfArtist(artistId).
        // Asumimos que userId es el "artistId" en tu repos, adáptalo si no es así.

        List<StatusKanbanDTO> statuses = List.of(new StatusKanbanDTO(statusKanbanOrder));
        StatusKanbanWithCommisionsDTO commisionsDTO = new StatusKanbanWithCommisionsDTO(55L,"Boceto","Algo",3.,EnumPaymentArrangement.INITIAL,"Prueba","client1", false, null);
        List<StatusKanbanWithCommisionsDTO> commisions = List.of(commisionsDTO);

        when(statusKanbanOrderRepository.getAllStatusOrdererOfArtist(100L)).thenReturn(statuses);
        when(statusKanbanOrderRepository.getAllCommisionsAcceptedOfArtist(100L)).thenReturn(commisions);

        StatusKanbanFullResponseDTO result = statusKanbanOrderService.getAllStatusFromArtist();

        assertNotNull(result);
        assertEquals(1, result.getStatuses().size());
        assertEquals("Boceto", result.getStatuses().get(0).getName());
        assertEquals(1, result.getCommissions().size());
        assertEquals(55L, result.getCommissions().get(0).getId());
    }*/

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

        statusKanbanOrderService.nextStatusOfCommision(c.getId());

        assertNull(c.getStatusKanbanOrder());
        // Se setea la comisión a ENDED
        assertEquals(StatusCommision.ENDED, c.getStatus());
        verify(commisionRepository, times(1)).save(c); // Se ejecuta dos veces, una para la nueva en IN_WAIT_LIST y otra para la original
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
}
