import React, { useContext, useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import { getAllUserMessages } from "@/src/services/chatService";
import { ConversationListStyles as styles } from "@/src/styles/ConversationListScreen.styles";

interface BaseUser {
  id: number;
  name: string;
}

export interface ChatMessage {
  id: number;
  text: string;
  creationDate: Date;
  fromUser: BaseUser;
  toUser: BaseUser;
}

interface Conversation {
  otherUser: BaseUser;
  lastMessage: ChatMessage;
}

export default function ConversationListScreen() {
  const router = useRouter();
  const { loggedInUser } = useContext(AuthenticationContext);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Carga todos los mensajes en los que participa el usuario actual
  const loadMessages = async () => {
    try {
      const msgs = await getAllUserMessages(loggedInUser.id, loggedInUser.token);
      setMessages(msgs);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los mensajes");
    } finally {
      setLoading(false);
    }
  };

  // Agrupa los mensajes en conversaciones (último mensaje con cada "otro" usuario)
  const groupMessagesToConversations = () => {
    const convMap: { [key: number]: ChatMessage } = {};
    messages.forEach((msg) => {
      const otherUser =
        msg.fromUser.id === loggedInUser.id ? msg.toUser : msg.fromUser;
      if (
        !convMap[otherUser.id] ||
        new Date(msg.creationDate) > new Date(convMap[otherUser.id].creationDate)
      ) {
        convMap[otherUser.id] = msg;
      }
    });

    const convArray: Conversation[] = Object.keys(convMap).map((key) => {
      const msg = convMap[parseInt(key)];
      const otherUser =
        msg.fromUser.id === loggedInUser.id ? msg.toUser : msg.fromUser;
      return { otherUser, lastMessage: msg };
    });

    // Ordena por fecha descendente
    convArray.sort(
      (a, b) =>
        new Date(b.lastMessage.creationDate).getTime() -
        new Date(a.lastMessage.creationDate).getTime()
    );
    setConversations(convArray);
  };

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    groupMessagesToConversations();
  }, [messages]);

  const renderItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => {
        // Navega a la pantalla de chat del usuario (id) correspondiente
        router.push(`/(drawer)/chats/${item.otherUser.id}`);
      }}
    >
      <Text style={styles.userName}>{item.otherUser.name}</Text>
      <Text style={styles.lastMessage} numberOfLines={1}>
        {item.lastMessage.text}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#F8C3CD" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {conversations.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.userName}>No tienes conversaciones</Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.otherUser.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}
