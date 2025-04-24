package com.HolosINC.Holos.chat;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    
    @Query("SELECT m FROM ChatMessage m WHERE m.commision.id = :commisionId ORDER BY m.creationDate DESC")
    List<ChatMessage> findConversationByCommisionId(Long commisionId);
}
