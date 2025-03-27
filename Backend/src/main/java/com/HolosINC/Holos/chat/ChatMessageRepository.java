package com.HolosINC.Holos.chat;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;




@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long>{
    @Query("SELECT m FROM ChatMessage m WHERE (m.fromUser.id = :fromUserId AND m.toUser.id = :toUserId) OR "
    + "(m.fromUser.id = :toUserId AND m.toUser.id = :fromUserId) ORDER BY m.creationDate DESC")
    List<ChatMessage> findConversation(Long fromUserId, Long toUserId);     

    @Query("SELECT new com.HolosINC.Holos.chat.ConversationDTO( " +
       "   CASE WHEN m.fromUser.id = :userId THEN m.toUser ELSE m.fromUser END, " +
       "   MAX(m.creationDate), " +
       "   SUBSTRING(MAX(CONCAT(m.creationDate, '#', m.text)), LOCATE('#', MAX(CONCAT(m.creationDate, '#', m.text))) + 1) " +
       ") " +
       "FROM ChatMessage m " +
       "WHERE m.fromUser.id = :userId OR m.toUser.id = :userId " +
       "GROUP BY CASE WHEN m.fromUser.id = :userId THEN m.toUser ELSE m.fromUser END " +
       "ORDER BY MAX(m.creationDate) DESC"
)
List<ConversationDTO> findAllConversations(@Param("userId") Long userId);

@Query("SELECT m FROM ChatMessage m "
         + "WHERE m.fromUser.id = :userId OR m.toUser.id = :userId "
         + "ORDER BY m.creationDate DESC")
    List<ChatMessage> findAllByUserId(Long userId);

}
