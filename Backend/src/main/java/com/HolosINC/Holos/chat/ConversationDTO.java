package com.HolosINC.Holos.chat;

import java.time.LocalDateTime;

import com.HolosINC.Holos.model.BaseUser;

@SuppressWarnings("unused")
public class ConversationDTO {
    private BaseUser otherUser;
    private LocalDateTime lastDate;
    private String lastMessage;
    
    // constructor, getters, setters
    public ConversationDTO(BaseUser otherUser, LocalDateTime lastDate, String lastMessage) {
        this.otherUser = otherUser;
        this.lastDate = lastDate;
        this.lastMessage = lastMessage;
    }
}