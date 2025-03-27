package com.HolosINC.Holos.Chat;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import com.HolosINC.Holos.chat.ChatMessage;
import com.HolosINC.Holos.chat.ChatMessageRepository;
import com.HolosINC.Holos.chat.ChatMessageService;
import com.HolosINC.Holos.exceptions.AccessDeniedException;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserService;

public class ChatServiceTest {

    @Mock
    private ChatMessageRepository chatMessageRepository;

    @Mock
    private BaseUserService baseUserService;

    @InjectMocks
    private ChatMessageService chatMessageService;

    private ChatMessage chatMessage;
    private BaseUser fromUser;
    private BaseUser toUser;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        chatMessage = new ChatMessage();
        chatMessage.setId(1L);
        chatMessage.setText("Hello");

        fromUser = new BaseUser();
        fromUser.setId(1L);

        toUser = new BaseUser();
        toUser.setId(2L);
    }

    @Test
    public void testCreateChatMessage() {
        when(baseUserService.findCurrentUser()).thenReturn(fromUser);
        when(chatMessageRepository.save(any(ChatMessage.class))).thenReturn(chatMessage);

        ChatMessage createdChatMessage = chatMessageService.createChatMessage(chatMessage);

        assertNotNull(createdChatMessage);
        assertEquals(chatMessage.getId(), createdChatMessage.getId());
        verify(chatMessageRepository, times(1)).save(chatMessage);
    }

    @Test
    public void testCreateChatMessage_NotLoggedIn() {
        when(baseUserService.findCurrentUser()).thenReturn(null);

        assertThrows(AccessDeniedException.class, () -> {
            chatMessageService.createChatMessage(chatMessage);
        });

        verify(chatMessageRepository, never()).save(any(ChatMessage.class));
    }

    @Test
    public void testFindChatMessage() {
        when(chatMessageRepository.findById(1L)).thenReturn(Optional.of(chatMessage));

        ChatMessage foundChatMessage = chatMessageService.findChatMessage(1L);

        assertNotNull(foundChatMessage);
        assertEquals(chatMessage.getId(), foundChatMessage.getId());
        verify(chatMessageRepository, times(1)).findById(1L);
    }

    @Test
    public void testFindChatMessage_NotFound() {
        when(chatMessageRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            chatMessageService.findChatMessage(1L);
        });

        verify(chatMessageRepository, times(1)).findById(1L);
    }

    @Test
    public void testFindAllChatMessages() {
        List<ChatMessage> chatMessages = Arrays.asList(chatMessage);
        when(chatMessageRepository.findAll()).thenReturn(chatMessages);

        List<ChatMessage> foundChatMessages = chatMessageService.findAllChatMessages();

        assertNotNull(foundChatMessages);
        assertEquals(1, foundChatMessages.size());
        verify(chatMessageRepository, times(1)).findAll();
    }

    @Test
    public void testFindConversation() {
        List<ChatMessage> chatMessages = Arrays.asList(chatMessage);
        when(baseUserService.findCurrentUser()).thenReturn(fromUser);
        when(chatMessageRepository.findConversation(1L, 2L)).thenReturn(chatMessages);

        List<ChatMessage> foundChatMessages = chatMessageService.findConversation(2L);

        assertNotNull(foundChatMessages);
        assertEquals(1, foundChatMessages.size());
        verify(chatMessageRepository, times(1)).findConversation(1L, 2L);
    }

    @Test
    public void testFindConversation_SameUser() {
        when(baseUserService.findCurrentUser()).thenReturn(fromUser);

        assertThrows(AccessDeniedException.class, () -> {
            chatMessageService.findConversation(1L);
        });

        verify(chatMessageRepository, never()).findConversation(anyLong(), anyLong());
    }

    @Test
    public void testDeleteMessage() {
        doNothing().when(chatMessageRepository).deleteById(1L);

        chatMessageService.deleteMessage(1L);

        verify(chatMessageRepository, times(1)).deleteById(1L);
    }
}
