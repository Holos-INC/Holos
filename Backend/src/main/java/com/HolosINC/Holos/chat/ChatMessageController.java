package com.HolosINC.Holos.chat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;




@RestController
@RequestMapping("/api/v1/messages")
public class ChatMessageController {
    private final ChatMessageService service;

    @Autowired
    public ChatMessageController(ChatMessageService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ChatMessage> createChatMessage(
        @RequestPart("chatMessage") String chatMessageJson,
        @RequestPart(value = "image", required = false) MultipartFile imageFile) { //Cambio Backend: He puesto el image a required false
        try {
            ObjectMapper mapper = new ObjectMapper();
            ChatMessage chatMessage = mapper.readValue(chatMessageJson, ChatMessage.class);

            if (imageFile != null && !imageFile.isEmpty()) {
                chatMessage.setImage(imageFile.getBytes());
            }
            
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

    @GetMapping("/chat/{commisionId}")
    public ResponseEntity<?> getConversation(@PathVariable Long commisionId) {
        try {
            return ResponseEntity.ok(service.findConversationByCommisionId(commisionId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/admin/chats")
    public ResponseEntity<?> getAllChats() {
        try {
            return ResponseEntity.ok(service.findAllConversations());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
