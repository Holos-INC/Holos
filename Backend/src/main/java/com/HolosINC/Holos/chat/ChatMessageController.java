package com.HolosINC.Holos.chat;

import java.time.LocalDateTime;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.HolosINC.Holos.commision.Commision;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/v1/messages")
public class ChatMessageController {
    private final ChatMessageService service;

    public ChatMessageController(ChatMessageService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> createChatMessage(
            @RequestPart("chatMessage") String chatMessageJson,
            @RequestPart(value = "imageProfile", required = false) MultipartFile imageFile) {
        System.out.println("chatMessageJson: " + chatMessageJson);

        try {
            ObjectMapper mapper = new ObjectMapper();
            ChatMessageRequestDTO messageDTO = mapper.readValue(chatMessageJson, ChatMessageRequestDTO.class);

            ChatMessage chatMessage = new ChatMessage();
            chatMessage.setText(messageDTO.getText());

            Long commisionId = Long.parseLong(messageDTO.getCommision());
            Commision commision = service.getCommisionById(commisionId);
            chatMessage.setCommision(commision);

            if (imageFile != null && !imageFile.isEmpty()) {
                chatMessage.setImage(imageFile.getBytes());
            }

            ChatMessage saved = service.createChatMessage(chatMessage);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating message: " + e.getMessage());
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
    public ResponseEntity<?> getConversation(
            @PathVariable Long commisionId,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        try {
            if (page != null && size != null) {
                return ResponseEntity.ok(service.getPagedConversation(commisionId, page, size).getContent());
            } else {
                return ResponseEntity.ok(service.getConversation(commisionId));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
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

    @GetMapping("/chat/{commisionId}/since")
    public ResponseEntity<?> getNewMessages(
            @PathVariable Long commisionId,
            @RequestParam("lastMessageDate") String lastMessageDateStr) {
        try {
            LocalDateTime lastDate = LocalDateTime.parse(lastMessageDateStr);
            return ResponseEntity.ok(service.getNewMessages(commisionId, lastDate));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid date or request: " + e.getMessage());
        }
    }

}
