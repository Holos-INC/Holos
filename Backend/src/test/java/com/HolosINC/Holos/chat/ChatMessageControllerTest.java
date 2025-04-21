package com.HolosINC.Holos.chat;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;

public class ChatMessageControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ChatMessageService chatMessageService;

    @InjectMocks
    private ChatMessageController chatMessageController;

    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(chatMessageController).build();
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());
    }

    // @Test
    // public void testCreateChatMessageSuccess() throws Exception {
    // ChatMessage chatMessage = new ChatMessage();
    // chatMessage.setText("Hello!");

    // when(chatMessageService.createChatMessage(any(ChatMessage.class))).thenReturn(chatMessage);

    // mockMvc.perform(post("/api/v1/messages")
    // .contentType(MediaType.APPLICATION_JSON)
    // .content(objectMapper.writeValueAsString(chatMessage)))
    // .andExpect(status().isOk());

    // verify(chatMessageService,
    // times(1)).createChatMessage(any(ChatMessage.class));
    // }

    // @Test
    // public void testCreateChatMessageFailure() throws Exception {
    // ChatMessage chatMessage = new ChatMessage();
    // chatMessage.setText("Hello!");

    // when(chatMessageService.createChatMessage(any(ChatMessage.class))).thenThrow(new
    // RuntimeException("Error creating message"));

    // mockMvc.perform(post("/api/v1/messages")
    // .contentType(MediaType.APPLICATION_JSON)
    // .content(objectMapper.writeValueAsString(chatMessage)))
    // .andExpect(status().isBadRequest());

    // verify(chatMessageService,
    // times(1)).createChatMessage(any(ChatMessage.class));
    // }

    @Test
    public void testDeleteChatMessageSuccess() throws Exception {
        doNothing().when(chatMessageService).deleteMessage(1L);

        mockMvc.perform(delete("/api/v1/messages/1"))
                .andExpect(status().isOk());

        verify(chatMessageService, times(1)).deleteMessage(1L);
    }

    @Test
    public void testDeleteChatMessageFailure() throws Exception {
        doThrow(new RuntimeException("Error deleting message")).when(chatMessageService).deleteMessage(1L);

        mockMvc.perform(delete("/api/v1/messages/1"))
                .andExpect(status().isBadRequest());

        verify(chatMessageService, times(1)).deleteMessage(1L);
    }

    @Test
    public void testGetConversationSuccess() throws Exception {
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setText("Hello!");

        when(chatMessageService.findConversationByCommisionId(1L)).thenReturn(List.of(chatMessage));

        mockMvc.perform(get("/api/v1/messages/chat/1"))
                .andExpect(status().isOk());

        verify(chatMessageService, times(1)).findConversationByCommisionId(1L);
    }

    @Test
    public void testGetConversationFailure() throws Exception {
        when(chatMessageService.findConversationByCommisionId(1L))
                .thenThrow(new RuntimeException("Error fetching conversation"));

        mockMvc.perform(get("/api/v1/messages/chat/1"))
                .andExpect(status().isBadRequest());

        verify(chatMessageService, times(1)).findConversationByCommisionId(1L);
    }

    @Test
    public void testGetAllChatsSuccess() throws Exception {
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setText("Hello!");

        Map<Long, List<ChatMessage>> chats = Map.of(1L, List.of(chatMessage));

        when(chatMessageService.findAllConversations()).thenReturn(chats);

        mockMvc.perform(get("/api/v1/messages/admin/chats"))
                .andExpect(status().isOk());

        verify(chatMessageService, times(1)).findAllConversations();
    }

    @Test
    public void testGetAllChatsFailure() throws Exception {
        when(chatMessageService.findAllConversations()).thenThrow(new RuntimeException("Error fetching chats"));

        mockMvc.perform(get("/api/v1/messages/admin/chats"))
                .andExpect(status().isBadRequest());

        verify(chatMessageService, times(1)).findAllConversations();
    }
    @Test
public void testCreateChatMessageSuccess() throws Exception {
    ChatMessage chatMessage = new ChatMessage();
    chatMessage.setText("Hello!");

    when(chatMessageService.createChatMessage(any(ChatMessage.class))).thenReturn(chatMessage);

    mockMvc.perform(post("/api/v1/messages")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(chatMessage)))
            .andExpect(status().isOk());

    verify(chatMessageService, times(1)).createChatMessage(any(ChatMessage.class));
}

@Test
public void testCreateChatMessageFailure() throws Exception {
    ChatMessage chatMessage = new ChatMessage();
    chatMessage.setText("Hello!");

    when(chatMessageService.createChatMessage(any(ChatMessage.class))).thenThrow(new RuntimeException("Error creating message"));

    mockMvc.perform(post("/api/v1/messages")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(chatMessage)))
            .andExpect(status().isBadRequest());

    verify(chatMessageService, times(1)).createChatMessage(any(ChatMessage.class));
}

}
