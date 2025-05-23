package com.HolosINC.Holos.chat;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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

    public ChatMessageService(ChatMessageRepository chatMessageRepository, BaseUserService baseUserService,
            CommisionRepository commisionRepository) {
        this.commisionRepository = commisionRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.baseUserService = baseUserService;
    }

    @Transactional
    public ChatMessage createChatMessage(ChatMessage chatMessage) throws Exception {
        BaseUser user = baseUserService.findCurrentUser();
        chatMessage.setSenderId(user.getId());
        chatMessage.setSenderName(user.getUsername());
        try {
            if (user == null) {
                throw new AccessDeniedException("You must be logged in to send a message");
            }
            if (chatMessage.getImage() != null && chatMessage.getImage().length > 5 * 1024 * 1024) {
                throw new IllegalArgumentException("The image cannot be larger than 5MB.");
            }
            return chatMessageRepository.save(chatMessage);
        } catch (Exception e) {
            throw new Exception();
        }
    }

    @Transactional(readOnly = true)
    public List<ChatMessage> findConversationByCommisionId(Long commisionId) throws Exception {
        BaseUser user = baseUserService.findCurrentUser();
        Commision commision = commisionRepository.findById(commisionId)
                .orElseThrow(() -> new ResourceNotFoundException("Commision", "id", commisionId));

        if (commision.getArtist().getBaseUser().getId() != user.getId()
                && commision.getClient().getBaseUser().getId() != user.getId()) {
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

    @Transactional
    public void deleteConversationByCommisionId(Long commisionId) {
        List<ChatMessage> messages = chatMessageRepository.findConversationByCommisionId(commisionId);
        chatMessageRepository.deleteAll(messages);
    }

    public List<ChatMessageResponseDTO> getConversation(Long commisionId) throws Exception {
        BaseUser user = baseUserService.findCurrentUser();
        Commision commision = commisionRepository.findById(commisionId)
                .orElseThrow(() -> new ResourceNotFoundException("Commision", "id", commisionId));

        if (!commision.getArtist().getBaseUser().getId().equals(user.getId()) &&
                !commision.getClient().getBaseUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You don't have access to this commision");
        }

        List<ChatMessage> messages = chatMessageRepository.findConversationByCommisionId(commisionId);
        return messages.stream().map(ChatMessageResponseDTO::new).toList();
    }

    public Page<ChatMessage> getPagedConversation(Long commisionId, int page, int size) throws Exception {
        BaseUser user = baseUserService.findCurrentUser();
        Commision commision = commisionRepository.findById(commisionId)
                .orElseThrow(() -> new ResourceNotFoundException("Commision", "id", commisionId));

        if (!commision.getArtist().getBaseUser().getId().equals(user.getId()) &&
                !commision.getClient().getBaseUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You don't have access to this commision");
        }

        return chatMessageRepository.findByCommisionId(commisionId, PageRequest.of(page, size));
    }

    public List<ChatMessageResponseDTO> getNewMessages(Long commisionId, LocalDateTime lastDate) throws Exception {
        BaseUser user = baseUserService.findCurrentUser();
        Commision commision = commisionRepository.findById(commisionId)
                .orElseThrow(() -> new ResourceNotFoundException("Commision", "id", commisionId));

        if (!commision.getArtist().getBaseUser().getId().equals(user.getId()) &&
                !commision.getClient().getBaseUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You don't have access to this commision");
        }

        List<ChatMessage> messages = chatMessageRepository.findNewMessages(commisionId, lastDate);
        return messages.stream().map(ChatMessageResponseDTO::new).toList();
    }

    public Commision getCommisionById(Long id) {
        return commisionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commision", "id", id));
    }

}
