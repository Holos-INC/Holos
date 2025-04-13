// app/chats/[commisionId].tsx
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import { getConversation, sendMessage, ChatMessage } from "@/src/services/chatService";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import { styles } from "@/src/styles/Chat.styles";


type ExtendedChatMessage = ChatMessage & { sentByMe?: boolean };

const STORAGE_KEY = (commId: string, userId: string) => `sentMessages_${commId}_${userId}`;

export default function ChatScreen() {
  const params = useLocalSearchParams() as {
    commisionId?: string;
    otherUsername?: string;
  };
  const { commisionId, otherUsername } = params;

  const { loggedInUser } = useContext(AuthenticationContext);

  const [messages, setMessages] = useState<ExtendedChatMessage[]>([]);
  const [text, setText] = useState("");
  const [selectedImage, setSelectedImage] = useState<{ uri: string; type: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const saveSentMessageId = (msgId: number) => {
    try {
      const key = STORAGE_KEY(commisionId!, loggedInUser.id.toString());
      const stored = localStorage.getItem(key);
      let ids: number[] = stored ? JSON.parse(stored) : [];
      if (!ids.includes(msgId)) {
        ids.push(msgId);
        localStorage.setItem(key, JSON.stringify(ids));
      }
    } catch (error) {
      console.error("Error guardando mensajes enviados:", error);
    }
  };

  const getSentMessageIds = (): number[] => {
    try {
      const key = STORAGE_KEY(commisionId!, loggedInUser.id.toString());
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error recuperando mensajes enviados:", error);
      return [];
    }
  };

  const markMessages = (msgs: ChatMessage[]): ExtendedChatMessage[] => {
    const sentIds = new Set(getSentMessageIds());
    return msgs.map((msg) => ({ ...msg, sentByMe: sentIds.has(msg.id) }));
  };

  const fetchMessages = async () => {
    if (!commisionId) return;
    try {
      const conv = await getConversation(Number(commisionId), loggedInUser.token);
      setMessages(markMessages(conv));
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!commisionId) return;
    fetchMessages();
    const interval = setInterval(() => {
      fetchMessages();
    }, 5000);
    return () => clearInterval(interval);
  }, [commisionId]);

  const handleSend = async () => {
    if (text.trim().length === 0 && !selectedImage) return;
    try {
      const newMsg = await sendMessage(Number(commisionId), text, selectedImage || undefined, loggedInUser.token);
      saveSentMessageId(newMsg.id);
      setMessages((prev) => [{ ...newMsg, sentByMe: true }, ...prev]);
      setText("");
      setSelectedImage(null);
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });
      if (!result.canceled) {
        const asset = result.assets[0];
        setSelectedImage({ uri: asset.uri, type: "image/jpeg", name: asset.fileName || "photo.jpg" });
      }
    } catch (error) {
      console.error("Error al seleccionar imagen:", error);
    }
  };

  const renderItem = ({ item }: { item: ExtendedChatMessage }) => {
    const isSentByMe = item.sentByMe === true;
    return (
      <View style={styles.messageRow}>
        <View
          style={[
            styles.messageBubble,
            isSentByMe ? styles.messageBubbleMe : styles.messageBubbleOther,
          ]}
        >
          {item.text ? <Text style={styles.messageText}>{item.text}</Text> : null}
          {item.image && (
            <Image
              source={{ uri: `data:image/jpeg;base64,${item.image}` }}
              style={styles.messageImage}
            />
          )}
          <Text style={styles.messageDate}>
            {new Date(item.creationDate).toLocaleString()}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Imagen de fondo en el centro */}
      <Image
        source={require("@/assets/images/logo.png")} 
        style={styles.backgroundLogo}
      />

      {/* Lista de mensajes (invertida) */}
      <FlatList
        data={messages}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        renderItem={renderItem}
        inverted
      />

      {/* Barra de entrada de texto/imágenes */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe un mensaje..."
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


