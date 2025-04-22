package com.HolosINC.Holos.chat;

import lombok.Data;

import java.util.Base64;

@Data
public class ChatMessageResponseDTO {
    private Long id;
    private String text;
    private String creationDate;
    private String image;
    private Long commisionId;
    private Long senderId;
    private String senderName;

    public ChatMessageResponseDTO(ChatMessage msg) {
        this.id = msg.getId();
        this.text = msg.getText();
        this.creationDate = msg.getCreationDate().toString();
        this.image = msg.getImage() != null ? Base64.getEncoder().encodeToString(msg.getImage()) : null;
        this.commisionId = msg.getCommision().getId();
        this.senderId = msg.getSenderId();
        this.senderName = msg.getSenderName();
    }
}
