package com.HolosINC.Holos.chat;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

import javax.validation.constraints.Size;

import com.HolosINC.Holos.commision.Commision;

@Data
@Entity
@Table(name = "chat_messages")
public class ChatMessage {

    @Id
	@SequenceGenerator(name = "entity_seq", sequenceName = "entity_sequence", initialValue = 100)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "entity_seq")
    private Long id;

    @Column(nullable = false, updatable = false)
    private LocalDateTime creationDate = LocalDateTime.now();

    @Size(max = 125)
    @Column(updatable = false, length = 125)
    private String text;

    @Lob
    @Column(name = "image", columnDefinition = "LONGBLOB", updatable = false)
    private byte[] image;

    @NotNull
    private String senderName;

    @NotNull
    private Long senderId;

    @ManyToOne
    @JoinColumn(nullable = false)
    private Commision commision;
}