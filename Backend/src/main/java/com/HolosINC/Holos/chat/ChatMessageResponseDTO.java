package com.HolosINC.Holos.chat;

import com.HolosINC.Holos.commision.Commision;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Base64;

@Data
public class ChatMessageResponseDTO {
    private Long id;
    private String text;
    private String creationDate;
    private String image;
    private Commision commision;

    public ChatMessageResponseDTO(ChatMessage msg) {
        this.id = msg.getId();
        this.text = msg.getText();
        this.creationDate = msg.getCreationDate().toString();
        this.image = msg.getImage() != null ? Base64.getEncoder().encodeToString(msg.getImage()) : null;
        this.commision = msg.getCommision();
    }
}
