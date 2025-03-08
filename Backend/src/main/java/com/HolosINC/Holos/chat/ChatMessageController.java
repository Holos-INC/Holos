package com.HolosINC.Holos.chat;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
    public ChatMessage createChatMessage(@RequestBody ChatMessage chatMessage) {
        return service.createChatMessage(chatMessage);
    }

    @DeleteMapping("/{id}")
    public void deleteChatMessage(@PathVariable Long id) {
        service.deleteMessage(id);
    }

    @GetMapping("/chat/{fromUserId}/{toUserId}")
    public List<ChatMessage> getConversation(@PathVariable Long fromUserId, @PathVariable Long toUserId) {
        return service.findConversation(fromUserId, toUserId);
    }

    @GetMapping
    public List<ChatMessage> getAllChatMessages() {
        return service.findAllChatMessages();
    }

    @GetMapping("/{id}")
    public ChatMessage getChatMessage(@PathVariable Long id) {
        return service.findChatMessage(id);
    }
}
