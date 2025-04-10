import React, { useContext, useEffect, useState } from "react";
import { 
  View, 
  FlatList, 
  Text, 
  TextInput, 
  Button, 
  StyleSheet, 
  ActivityIndicator, 
  Alert 
} from "react-native";
import { getConversation, sendMessage } from "@/src/services/chatService";
import { ChatMessage } from "@/src/services/chatMessage";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { useLocalSearchParams } from "expo-router";
import { getClientById } from "@/src/services/clientApi";
import { getArtistByBaseId } from "@/src/services/artistApi";
import { BaseUser } from "@/src/constants/ExploreTypes";

export default function ChatScreen() {
  // Obtención del parámetro de la URL
  const { toUserId } = useLocalSearchParams();

  if (!toUserId) {
    return (
      <View style={styles.centered}>
        <Text>Error: no se ha proporcionado el parámetro toUserId</Text>
      </View>
    );
  }

  const numericToUserId = Number(toUserId);
  if (isNaN(numericToUserId)) {
    return (
      <View style={styles.centered}>
        <Text>Error: el parámetro toUserId no es un número válido</Text>
      </View>
    );
  }

  const { loggedInUser } = useContext(AuthenticationContext);
  const userId = loggedInUser.id;
  const token = loggedInUser.token; 

  // Estado para el usuario destino, mensajes, etc.
  const [toUser, setToUser] = useState<BaseUser | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [lastSentMessage, setLastSentMessage] = useState<string | null>(null);

  /**
   * Función para obtener el BaseUser a partir de su ID.
   * Primero intenta obtenerlo como artista; de no encontrarse, lo busca como cliente.
   */
  const getBaseUserById = async (userId: number): Promise<BaseUser | null> => {
    try {
      // Intentamos obtener al artista usando el endpoint /byBaseUser
      const artistResult = await getArtistByBaseId(userId);
      let baseUser = artistResult?.baseUser;
      if (!baseUser) {
        // Si no es artista, se intenta obtener como cliente
        const clientResult = await getClientById(userId);
        baseUser = clientResult?.baseUser;
      }
      return baseUser;
    } catch (error) {
      console.error("Error obteniendo el BaseUser:", error);
      return null;
    }
  };

  // Cargar el usuario destino
  useEffect(() => {
    const loadToUser = async () => {
      const user = await getBaseUserById(numericToUserId);
      if (user) {
        setToUser(user);
      } else {
        Alert.alert("Error", "No se encontró el usuario destino");
      }
    };
    loadToUser();
  }, [numericToUserId]);

  // Función para cargar la conversación con el usuario destino
  const loadConversation = async () => {
    try {
      const conversation = await getConversation(numericToUserId, token);
      setMessages(conversation);
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar la conversación");
    } finally {
      setLoading(false);
    }
  };

  // Se carga la conversación cuando el componente se monta y se actualiza cada 5 segundos
  useEffect(() => {
    if (userId) {
      loadConversation();
      const interval = setInterval(loadConversation, 5000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  // Función para enviar mensaje
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !toUser) return;
    try {
      const messagePayload = {
        text: newMessage,
        fromUser: loggedInUser,
        toUser: toUser,
      };

      console.log("Enviando mensaje:", newMessage);
      const sentMessage = await sendMessage(messagePayload, token);

      // Asegurarse de que creationDate sea un objeto Date
      if (typeof sentMessage.creationDate === "string") {
        sentMessage.creationDate = new Date(sentMessage.creationDate);
      }
      console.log("Mensaje enviado:", sentMessage);
      setNewMessage("");
      setLastSentMessage(sentMessage.text);
      await loadConversation();
      setTimeout(() => {
        setLastSentMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      Alert.alert("Error", "No se pudo enviar el mensaje");
    }
  };

  // Renderizado de cada mensaje
  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isSentByCurrentUser = item.fromUser.id === userId;
    return (
      <View
        style={[
          styles.messageContainer,
          isSentByCurrentUser ? styles.sent : styles.received,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.messageDate}>
          {new Date(item.creationDate).toLocaleString()}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#888" />
      </View>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["ARTIST", "ARTIST_PREMIUM", "CLIENT"]}>
      <View style={styles.mainContainer}>
        <View style={styles.container}>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMessage}
            contentContainerStyle={styles.messagesList}
            inverted
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Escribe un mensaje..."
              value={newMessage}
              onChangeText={setNewMessage}
            />
            <Button title="Enviar" onPress={handleSendMessage} />
          </View>
        </View>
        {/* Sidebar para mostrar el mensaje enviado recientemente */}
        {lastSentMessage && (
          <View style={styles.sidebar}>
            <Text style={styles.sidebarText}>Mensaje enviado: {lastSentMessage}</Text>
          </View>
        )}
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    position: "relative",
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  messagesList: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  messageContainer: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    maxWidth: "80%",
  },
  sent: {
    alignSelf: "flex-end",
    backgroundColor: "#dcf8c6",
  },
  received: {
    alignSelf: "flex-start",
    backgroundColor: "#eee",
  },
  messageText: {
    fontSize: 16,
  },
  messageDate: {
    fontSize: 10,
    color: "gray",
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sidebar: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 200,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    padding: 10,
    justifyContent: "center",
  },
  sidebarText: {
    color: "black",
    fontSize: 16,
  },
});
