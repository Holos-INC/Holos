package com.HolosINC.Holos.chat;

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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/messages")
@Tag(name = "Chat Messages", description = "APIs for creating, deleting, and fetching chat messages and conversations")
public class ChatMessageController {
    private final ChatMessageService service;

    public ChatMessageController(ChatMessageService service) {
        this.service = service;
    }

    @Operation(
        summary = "Create a new chat message",
        description = "Creates a new chat message. Optionally, a message can include an image.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Chat message created successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ChatMessage.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input or error creating message", content = @Content(mediaType = "application/json"))
        }
    )
    @PostMapping
    public ResponseEntity<ChatMessage> createChatMessage(
        @RequestPart("chatMessage") String chatMessageJson,
        @RequestPart(value = "image", required = false) MultipartFile imageFile) {
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

    @Operation(
        summary = "Delete a chat message",
        description = "Deletes a chat message by its ID.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Chat message deleted successfully", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "400", description = "Error deleting message", content = @Content(mediaType = "application/json"))
        }
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteChatMessage(@PathVariable Long id) {
        try {
            service.deleteMessage(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(
        summary = "Get a conversation by commission ID",
        description = "Fetches the conversation related to a specific commission ID.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Conversation fetched successfully", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "400", description = "Error fetching conversation", content = @Content(mediaType = "application/json"))
        }
    )
    @GetMapping("/chat/{commisionId}")
    public ResponseEntity<?> getConversation(@PathVariable Long commisionId) {
        try {
            return ResponseEntity.ok(service.findConversationByCommisionId(commisionId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(
        summary = "Get all chat conversations",
        description = "Fetches all chat conversations in the system.",
        responses = {
            @ApiResponse(responseCode = "200", description = "All chats fetched successfully", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "400", description = "Error fetching chats", content = @Content(mediaType = "application/json"))
        }
    )
    @GetMapping("/admin/chats")
    public ResponseEntity<?> getAllChats() {
        try {
            return ResponseEntity.ok(service.findAllConversations());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
