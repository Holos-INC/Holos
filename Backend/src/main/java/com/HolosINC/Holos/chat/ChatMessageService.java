package com.HolosINC.Holos.chat;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.HolosINC.Holos.commision.Commision;
import com.HolosINC.Holos.commision.CommisionRepository;
import com.HolosINC.Holos.exceptions.AccessDeniedException;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserService;

@SuppressWarnings("unused")
@Service
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final BaseUserService baseUserService;
    private final CommisionRepository commisionRepository;

    public ChatMessageService(ChatMessageRepository chatMessageRepository, BaseUserService baseUserService, CommisionRepository commisionRepository) {
        this.commisionRepository = commisionRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.baseUserService = baseUserService;
    }

    @Transactional
    public ChatMessage createChatMessage(ChatMessage chatMessage) throws Exception {
        BaseUser user = baseUserService.findCurrentUser();
        try{
            if (user == null) {
                throw new AccessDeniedException("You must be logged in to send a message");
            }
            if (chatMessage.getImage().length > 5 * 1024 * 1024) {
                throw new IllegalArgumentException("The image cannot be larger than 5MB.");
            }
            return chatMessageRepository.save(chatMessage);
        } catch (Exception e) {
            throw new Exception();
        }
    }

    @Transactional(readOnly = true)
    public List<ChatMessage> findConversationByCommisionId(Long commisionId) throws Exception{
        BaseUser user = baseUserService.findCurrentUser();
        Commision commision = commisionRepository.findById(commisionId).orElse(null);
        if (commision == null) {
            throw new ResourceNotFoundException("Commision", "id", commisionId);
        }
        if (commision.getArtist().getBaseUser().getId() != user.getId() && commision.getClient().getBaseUser().getId() != user.getId()) {
            throw new AccessDeniedException("You don't have access to this commision");
        }
        return chatMessageRepository.findConversationByCommisionId(commisionId);
    }

    @Transactional
    public void deleteMessage(Long id) {
        chatMessageRepository.deleteById(id);
    }

    @Transactional
    public Map<Long, List<ChatMessage>> findAllConversations() {
        BaseUser user = baseUserService.findCurrentUser();
        List<ChatMessage> chatMessages = chatMessageRepository.findAll();

        Map<Long, List<ChatMessage>> conversations = new HashMap<>();
        for (ChatMessage message : chatMessages) {
            if (conversations.containsKey(message.getCommision().getId())) {
                conversations.get(message.getCommision().getId()).add(message);
            } else {
                conversations.put(message.getCommision().getId(), new ArrayList<>(List.of(message)));
            }
        }

        return conversations;
    }
}
