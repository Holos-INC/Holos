package com.HolosINC.Holos.client;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Collections;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.dao.DataAccessException;

import com.HolosINC.Holos.Kanban.StatusKanbanOrderService;
import com.HolosINC.Holos.commision.CommisionRepository;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserRepository;

import com.HolosINC.Holos.reports.ReportRepository;

public class ClientServiceTest {
    
    @Mock
    private ClientRepository clientRepository;

    @Mock
    private BaseUserRepository baseUserRepository;

    @Mock
    private CommisionRepository commisionRepository;

    @Mock
    private StatusKanbanOrderService statusKanbanOrderService;

    @Mock
    private ReportRepository reportRepository;


    @InjectMocks
    private ClientService clientService;

    private Client client;

    private BaseUser baseUser;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        client = new Client();
        client.setId(1L);
        baseUser = new BaseUser();
        baseUser.setId(1L);
        client.setBaseUser(baseUser);
    }

    @Test
    public void testSaveClientSuccess() {
        when(clientRepository.save(client)).thenReturn(client);

        Client savedClient = clientService.saveClient(client);

        assertNotNull(savedClient);
        assertEquals(client.getId(), savedClient.getId());
        verify(clientRepository, times(1)).save(client);
    }

    @Test
    public void testSaveClientFailure() {
        when(clientRepository.save(client)).thenThrow(new DataAccessException("Error saving client") {});

        assertThrows(DataAccessException.class, () -> {
            clientService.saveClient(client);
        });

        verify(clientRepository, times(1)).save(client);
    }

    @Test
    public void testFindClientByIdSuccess() {
        when(clientRepository.findById(1L)).thenReturn(Optional.of(client));

        Client foundClient = clientService.findClient(1L);

        assertNotNull(foundClient);
        assertEquals(client.getId(), foundClient.getId());
        verify(clientRepository, times(1)).findById(1L);
    }

    @Test
    public void testFindClientByIdNotFound() {
        when(clientRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            clientService.findClient(1L);
        });

        verify(clientRepository, times(1)).findById(1L);
    }

    @Test
    public void testFindClientByUserIdSuccess() {
        when(clientRepository.findClientByUserId(1L)).thenReturn(Optional.of(client));
        
        Client foundClient = clientService.findClientByUserId(1L);
        assertNotNull(foundClient);
        assertEquals(client.getId(), foundClient.getId());
        verify(clientRepository, times(1)).findClientByUserId(1L);
    }

    @Test
    public void testFindClientByUserIdNotFound() {
        when(clientRepository.findClientByUserId(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            clientService.findClientByUserId(1L);
        });

        verify(clientRepository, times(1)).findClientByUserId(1L);
    }

    @Test
    public void testIsClientTrue() {
        when(clientRepository.findClientByUserId(1L)).thenReturn(Optional.of(client));

        boolean isClient = clientService.isClient(1L);

        assertTrue(isClient);
        verify(clientRepository, times(1)).findClientByUserId(1L);
    }

    @Test
    public void testIsClientFalse() {
        when(clientRepository.findClientByUserId(1L)).thenReturn(Optional.empty());

        boolean isClient = clientService.isClient(1L);

        assertFalse(isClient);
        verify(clientRepository, times(1)).findClientByUserId(1L);
    }

    @Test
    public void testDeleteClientSuccess() throws Exception {
        when(clientRepository.findById(1L)).thenReturn(Optional.of(client));
        when(clientRepository.findClientByUserId(1L)).thenReturn(Optional.of(client));

        clientService.deleteClient(1L);
        when(commisionRepository.findAllByClientId(1L)).thenReturn(Collections.emptyList());
        when(reportRepository.findAllByReportedUserId(null)).thenReturn(Collections.emptyList());
        when(clientRepository.hasActiveCommisions(1L)).thenReturn(false);


        verify(clientRepository, times(1)).delete(client);
        verify(baseUserRepository, times(1)).deleteById(1L);
    }

    @Test
    public void testDeleteClientNotFound() {
        when(clientRepository.findClientByUserId(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            clientService.deleteClient(1L);;
        });

        verify(clientRepository, never()).delete(any(Client.class));
    }    
    //check
     

}
