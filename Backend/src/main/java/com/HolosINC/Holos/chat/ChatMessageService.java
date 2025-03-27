package com.HolosINC.Holos.chat;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.HolosINC.Holos.exceptions.AccessDeniedException;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserService;

@SuppressWarnings("unused")
@Service
public class ChatMessageService {
    private ChatMessageRepository chatMessageRepository;
    private final BaseUserService baseUserService;

    @Autowired
    public ChatMessageService(ChatMessageRepository chatMessageRepository, BaseUserService baseUserService) {
        this.chatMessageRepository = chatMessageRepository;
        this.baseUserService = baseUserService;
    }

    
    @Transactional
    public ChatMessage createChatMessage(ChatMessage chatMessage) {
        BaseUser user = baseUserService.findCurrentUser();
        if (user == null) {
            throw new AccessDeniedException("You must be logged in to send a message");
        }
        return chatMessageRepository.save(chatMessage);
    }

    @Transactional(readOnly = true)
    public ChatMessage findChatMessage(Long chatMessageId) {
        BaseUser fromUser = baseUserService.findCurrentUser();
		return chatMessageRepository.findById(chatMessageId)
				.orElseThrow(() -> new ResourceNotFoundException("ChatMessage", "id", chatMessageId));
	}

    @Transactional(readOnly = true)
    public List<ChatMessage> findAllChatMessages() {
		return chatMessageRepository.findAll();
	}

    @Transactional(readOnly = true)
    public List<ChatMessage> findConversation(Long toUserId) {
        BaseUser fromUser = baseUserService.findCurrentUser();
        if (fromUser.getId().equals(toUserId)) {
            throw new AccessDeniedException("You can't send a message to yourself");
        }
        return chatMessageRepository.findConversation(fromUser.getId(), toUserId);
	}

    @Transactional
    public void deleteMessage(Long id) {
        chatMessageRepository.deleteById(id);
    }

    @Transactional
    public List<ConversationDTO> findAllConversations(Long userId) {
        return chatMessageRepository.findAllConversations(userId);
    }
    
    @Transactional
    public List<ChatMessage> findAllMessagesByUser(Long userId) {
        return chatMessageRepository.findAllByUserId(userId);
    }
    
}
