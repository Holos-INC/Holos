package com.HolosINC.Holos.chat;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import io.swagger.v3.oas.annotations.parameters.RequestBody;



@RestController
@RequestMapping("/api/v1/messages")
public class ChatMessageController {
    private final ChatMessageService service;

    @Autowired
    public ChatMessageController(ChatMessageService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ChatMessage> createChatMessage(@RequestBody ChatMessage chatMessage) {
        try {
            ChatMessage newChatMessage = service.createChatMessage(chatMessage);
            return ResponseEntity.ok(newChatMessage);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteChatMessage(@PathVariable Long id) {
        try {
            service.deleteMessage(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/chat/{toUserId}")
    public ResponseEntity<List<ChatMessage>> getConversation(@PathVariable Long toUserId) {
        try {
            List<ChatMessage> conversation = service.findConversation(toUserId);
            return ResponseEntity.ok(conversation);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/admin")
    public ResponseEntity<List<ChatMessage>> getAllChatMessages() {
        try {
            List<ChatMessage> messages = service.findAllChatMessages();
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChatMessage> getChatMessage(@PathVariable Long id) {
        try {
            ChatMessage chatMessage = service.findChatMessage(id);
            return ResponseEntity.ok(chatMessage);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    @GetMapping("/conversations/user/{userId}")
public ResponseEntity<List<ConversationDTO>> getUserConversations(@PathVariable Long userId) {
    List<ConversationDTO> convos = service.findAllConversations(userId);
    return ResponseEntity.ok(convos);
}

@GetMapping("/allByUser/{userId}")
public ResponseEntity<List<ChatMessage>> getAllMessagesByUser(@PathVariable Long userId) {
    try {
        List<ChatMessage> messages = service.findAllMessagesByUser(userId);
        return ResponseEntity.ok(messages);
    } catch (Exception e) {
        return ResponseEntity.notFound().build();
    }
}

}
