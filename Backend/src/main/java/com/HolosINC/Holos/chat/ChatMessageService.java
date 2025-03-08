package com.HolosINC.Holos.chat;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;


@Service
public class ChatMessageService {
        private ChatMessageRepository chatMessageRepository;

    @Autowired
    public ChatMessageService(ChatMessageRepository chatMessageRepository) {
        this.chatMessageRepository = chatMessageRepository;
    }

    @Transactional
    public ChatMessage createChatMessage(ChatMessage chatMessage) {
        return chatMessageRepository.save(chatMessage);
    }

    @Transactional(readOnly = true)
	public ChatMessage findChatMessage(Long chatMessageId) {
		return chatMessageRepository.findById(chatMessageId)
				.orElseThrow(() -> new ResourceNotFoundException("ChatMessage", "id", chatMessageId));
	}

    @Transactional(readOnly = true)
	public List<ChatMessage> findAllChatMessages() {
		return chatMessageRepository.findAll();
	}

    @Transactional(readOnly = true)
	public List<ChatMessage> findConversation(Long fromUserId, Long toUserId) {
		return chatMessageRepository.findConversation(fromUserId, toUserId);
	}

    @Transactional
    public void deleteMessage(Long id) {
        chatMessageRepository.deleteById(id);
    }
}
