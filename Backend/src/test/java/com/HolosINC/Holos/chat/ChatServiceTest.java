package com.HolosINC.Holos.chat;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.client.Client;
import com.HolosINC.Holos.commision.Commision;
import com.HolosINC.Holos.commision.CommisionRepository;
import com.HolosINC.Holos.exceptions.AccessDeniedException;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserService;

public class ChatServiceTest {

    @Mock
    private ChatMessageRepository chatMessageRepository;

    @Mock
    private BaseUserService baseUserService;

    @Mock
    private CommisionRepository commisionRepository;

    @InjectMocks
    private ChatMessageService chatMessageService;

    private BaseUser currentUser;
    private BaseUser user2;
    private Commision commision;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        currentUser = new BaseUser();
        currentUser.setId(1L);

        user2 = new BaseUser();
        user2.setId(2L);

        commision = new Commision();
        commision.setId(1L);

        commision.setArtist(new Artist());
        commision.getArtist().setBaseUser(new BaseUser());
        commision.getArtist().getBaseUser().setId(1L);

        commision.setClient(new Client());
        commision.getClient().setBaseUser(new BaseUser());
        commision.getClient().getBaseUser().setId(2L);
    }

    @Test
    public void testCreateChatMessageSuccess() throws Exception{
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setText("Hello!");

        when(baseUserService.findCurrentUser()).thenReturn(currentUser);
        when(chatMessageRepository.save(chatMessage)).thenReturn(chatMessage);

        ChatMessage result = chatMessageService.createChatMessage(chatMessage);

        assertNotNull(result);
        assertEquals("Hello!", result.getText());
        verify(chatMessageRepository, times(1)).save(chatMessage);
    }

    @Test
    public void testCreateChatMessageAccessDenied() {
        when(baseUserService.findCurrentUser()).thenReturn(null);

        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setText("Hello!");

        assertThrows(AccessDeniedException.class, () -> {
            chatMessageService.createChatMessage(chatMessage);
        });

        verify(chatMessageRepository, never()).save(any(ChatMessage.class));
    }

    @Test
    public void testFindConversationByCommisionIdSuccess() throws Exception {
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setCommision(commision);

        when(baseUserService.findCurrentUser()).thenReturn(currentUser);
        when(commisionRepository.findById(1L)).thenReturn(Optional.of(commision));
        when(chatMessageRepository.findConversationByCommisionId(1L)).thenReturn(List.of(chatMessage));

        List<ChatMessage> result = chatMessageService.findConversationByCommisionId(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(chatMessageRepository, times(1)).findConversationByCommisionId(1L);
    }

    @Test
    public void testFindConversationByCommisionIdNotFound() {
        when(baseUserService.findCurrentUser()).thenReturn(currentUser);
        when(commisionRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            chatMessageService.findConversationByCommisionId(1L);
        });

        verify(chatMessageRepository, never()).findConversationByCommisionId(anyLong());
    }

    @Test
    public void testFindConversationByCommisionIdAccessDenied() throws Exception {
        // Configura el usuario actual
        when(baseUserService.findCurrentUser()).thenReturn(currentUser);

        // Configura la comisión para que el usuario actual no sea ni cliente ni artista
        commision.getClient().getBaseUser().setId(3L); // Cliente con ID diferente al usuario actual
        commision.getArtist().getBaseUser().setId(4L); // Artista con ID diferente al usuario actual

        when(commisionRepository.findById(1L)).thenReturn(Optional.of(commision));

        // Ejecuta el método y verifica que se lance AccessDeniedException
        assertThrows(AccessDeniedException.class, () -> {
            chatMessageService.findConversationByCommisionId(1L);
        });

        // Verifica que no se haya llamado al repositorio de mensajes
        verify(chatMessageRepository, never()).findConversationByCommisionId(anyLong());
    }

    @Test
    public void testDeleteMessageSuccess() {
        doNothing().when(chatMessageRepository).deleteById(1L);
        chatMessageService.deleteMessage(1L);
        verify(chatMessageRepository, times(1)).deleteById(1L);
    }

    @Test
    public void testFindAllConversationsSuccess() {
        ChatMessage chatMessage1 = new ChatMessage();
        chatMessage1.setCommision(commision);

        ChatMessage chatMessage2 = new ChatMessage();
        chatMessage2.setCommision(commision);

        when(baseUserService.findCurrentUser()).thenReturn(currentUser);
        when(chatMessageRepository.findAll()).thenReturn(List.of(chatMessage1, chatMessage2));

        Map<Long, List<ChatMessage>> result = chatMessageService.findAllConversations();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(2, result.get(1L).size());
        verify(chatMessageRepository, times(1)).findAll();
    }
}
