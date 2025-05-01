package com.HolosINC.Holos.chat;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    @Query("SELECT m FROM ChatMessage m WHERE m.commision.id = :commisionId ORDER BY m.creationDate ASC")
    List<ChatMessage> findConversationByCommisionId(Long commisionId);

    @Query("SELECT m FROM ChatMessage m WHERE m.commision.id = :commisionId ORDER BY m.creationDate DESC")
    Page<ChatMessage> findByCommisionId(Long commisionId, Pageable pageable);

    @Query("SELECT m FROM ChatMessage m WHERE m.commision.id = :commisionId AND m.creationDate > :lastDate ORDER BY m.creationDate ASC")
    List<ChatMessage> findNewMessages(Long commisionId, LocalDateTime lastDate);

}