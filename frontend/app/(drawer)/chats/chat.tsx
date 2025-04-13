// app/chats/index.tsx
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { getAcceptedCommissions } from "@/src/services/commisionApi";
import { ClientCommissionDTO } from "@/src/constants/CommissionTypes";
import { useRouter } from "expo-router";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import { styles } from "@/src/styles/ListChats.styles";

export default function ChatListScreen() {
  const { loggedInUser } = useContext(AuthenticationContext);
  const [acceptedChats, setAcceptedChats] = useState<ClientCommissionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchChats = async () => {
    try {
      const token = loggedInUser.token;
      const data = await getAcceptedCommissions(token);
      console.log("Accepted chats:", data);
      setAcceptedChats(data);
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const renderItem = ({ item }: { item: ClientCommissionDTO }) => {
    console.log("Chat item:", item);
    const otherUsername =
      loggedInUser.username === item.artistUsername
        ? item.clientUsername
        : item.artistUsername;
    const commissionId = item.id;
    console.log("Navegando con ID:", commissionId);

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() =>
          router.push(
            `/chats/${commissionId}?otherUsername=${encodeURIComponent(otherUsername)}`
          )
        }
      >
        <Image
          source={{
            uri: item.image
              ? `data:image/jpeg;base64,${item.image}`
              : "https://via.placeholder.com/50",
          }}
          style={styles.chatImage}
        />
        <View style={styles.chatInfo}>
          <Text style={styles.chatTitle}>{item.name}</Text>
          <Text style={styles.chatSubtitle}>Chat con {otherUsername}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: "#ADD8E6" }]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={acceptedChats}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : index.toString()
        }
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No hay chats disponibles.</Text>
          </View>
        }
      />
    </View>
  );
}

