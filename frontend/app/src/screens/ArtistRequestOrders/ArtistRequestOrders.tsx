import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAllCommisions, updateCommisionStatus } from "../../../services/CommisionService";
import { AuthenticationContext } from "@/app/context/AuthContext";
import { getUserTypeById } from "@/app/services/UserService";
import { useFocusEffect } from "@react-navigation/native";

// 1. Define la interfaz (o type) que describe tu modelo de Commission:
interface Commission {
  id: number;
  description: string;
  status: string; // PENDING, ACCEPTED, REJECTED, etc.
  client?: {
    id: number;
    username: string;
    imageProfile?: string;
  };
  artist?: {
    id: number;
    username: string;
  };
}

// 2. Ajusta la pantalla
const { width } = Dimensions.get("window");
const isBigScreen = width >= 1024;
const MOBILE_PROFILE_ICON_SIZE = 40;
const MOBILE_CARD_PADDING = 12;

export default function ArtistRequestOrders() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const { loggedInUser } = useContext(AuthenticationContext);

  const fetchCommissions = async () => {
    try {
      const userType = await getUserTypeById(loggedInUser.id);
      if (userType !== "ARTIST") {
        setCommissions([]);
        return;
      }
      const data: Commission[] = await getAllCommisions();
      const filteredData = data.filter((comm) => comm.artist?.id === loggedInUser.id);
      setCommissions(filteredData);
    } catch (error) {
      Alert.alert("Error", "Error al obtener las comisiones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissions();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchCommissions();
    }, [loggedInUser])
  );

  const handleUpdateStatus = async (commissionId: number, status: "ACCEPTED" | "REJECTED") => {
    try {
      await updateCommisionStatus(commissionId, loggedInUser.id, status);
      Alert.alert("Éxito", `Solicitud ${status === "ACCEPTED" ? "aceptada" : "denegada"}.`);
      fetchCommissions();
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el estado de la comisión.");
    }
  };

  const newRequests = commissions.filter((comm) => comm.status === "REQUESTED");
  const respondedRequests = commissions.filter((comm) => comm.status !== "REQUESTED");

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.bannerText}>BANDEJA DE ENTRADA</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>NUEVAS SOLICITUDES</Text>
        {newRequests.length === 0 ? (
          <Text style={styles.noRequestsText}>No hay nuevas solicitudes.</Text>
        ) : (
          newRequests.map((comm) => (
            <View key={comm.id} style={styles.card}>
              <Image
                source={{
                  uri: comm.client?.imageProfile || "https://via.placeholder.com/60",
                }}
                style={styles.profileIcon}
              />
              <View style={styles.textContainer}>
                <Text style={styles.text}>{comm.client?.username || "Usuario desconocido"}</Text>
                <Text style={styles.text}>Descripción: {comm.description}</Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => handleUpdateStatus(comm.id, "ACCEPTED")}
                >
                  <Ionicons name="checkmark" size={24} color="#183771" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={() => handleUpdateStatus(comm.id, "REJECTED")}
                >
                  <Ionicons name="close" size={24} color="#183771" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <Text style={styles.sectionTitle}>SOLICITUDES ACEPTADAS/DENEGADAS</Text>
        {respondedRequests.length === 0 ? (
          <Text style={styles.noRequestsText}>No hay solicitudes respondidas.</Text>
        ) : (
          respondedRequests.map((comm) => (
            <View key={comm.id} style={styles.card}>
              <Image
                source={{
                  uri: comm.client?.imageProfile || "https://via.placeholder.com/60",
                }}
                style={styles.profileIcon}
              />
              <View style={styles.textContainer}>
                <Text style={styles.text}>{comm.client?.username || "Usuario desconocido"}</Text>
                <Text style={styles.text}>Descripción: {comm.description}</Text>
              </View>
              <View style={styles.actions}>
                <Text style={styles.responseText}>
                  {comm.status === "ACCEPTED" ? "Solicitud aceptada" : "Solicitud denegada"}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    padding: isBigScreen ? 40 : 0,
  },
  banner: {
    backgroundColor: "#183771",
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 20,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  noRequestsText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: isBigScreen ? 15 : MOBILE_CARD_PADDING,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  profileIcon: {
    width: isBigScreen ? 60 : MOBILE_PROFILE_ICON_SIZE,
    height: isBigScreen ? 60 : MOBILE_PROFILE_ICON_SIZE,
    backgroundColor: "#D9D9D9",
    borderRadius: 30,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: 14,
    color: "#333",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: "#FECEF1",
    borderRadius: 20,
    padding: 8,
    marginRight: 5,
  },
  rejectButton: {
    backgroundColor: "#F05A7E",
    borderRadius: 20,
    padding: 8,
  },
  responseText: {
    fontSize: 14,
    color: "#183771",
    fontWeight: "bold",
  },
});
