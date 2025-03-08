package com.HolosINC.Holos.chat;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;




@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long>{
    @Query("SELECT m FROM ChatMessage m WHERE (m.fromUser.id = :fromUserId AND m.toUser.id = :toUserId) OR "
    + "(m.fromUser.id = :toUserId AND m.toUser.id = :fromUserId) ORDER BY m.creationDate DESC")
    List<ChatMessage> findConversation(Long fromUserId, Long toUserId);     
}
