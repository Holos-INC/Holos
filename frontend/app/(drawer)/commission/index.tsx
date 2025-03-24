import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { getAllRequestedCommisions, updateCommisionStatus } from "@/src/services/commisionApi";
import { Commission } from "@/src/constants/CommissionTypes";

// 2. Ajusta la pantalla
const { width } = Dimensions.get("window");
const isBigScreen = width >= 1024;
const MOBILE_PROFILE_ICON_SIZE = 40;
const MOBILE_CARD_PADDING = 12;

export default function ArtistRequestOrders({ route }: any) {
  const { loggedInUser } = useContext(AuthenticationContext);

  // 3. Tipar el estado como arreglo de Commission
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCommissions = async () => {
    try {
      const data: Commission[] = await getAllRequestedCommisions(loggedInUser.token);
      setCommissions(data);
    } catch (error) {
      Alert.alert("Error", "Error al obtener las comisiones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissions();
  }, []);

  const handleUpdateStatus = async (commissionId: number, accept: boolean) => {
    try {
      await updateCommisionStatus(commissionId, loggedInUser.id, accept, loggedInUser.token);
      Alert.alert("Éxito", `Solicitud ${accept ? "aceptada" : "denegada"}.`);
      fetchCommissions();
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el estado de la comisión.");
    }
  };

  // Filtra según estado
  // Considera REQUESTED como "nueva solicitud"
const newRequests = commissions.filter(
  (comm) => comm.status === "REQUESTED"
);

// Considera como "respondidas" todo lo que NO sea REQUESTED
const respondedRequests = commissions.filter(
  (comm) => comm.status !== "REQUESTED"
);


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["ARTIST"]}>
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
                <View style={styles.textContainer}>
                  <Text style={styles.text}>
                    {comm.client?.baseUser.username || "Usuario desconocido"}
                  </Text>
                  <Text style={styles.text}>Descripción: {comm.description}</Text>
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => handleUpdateStatus(comm.id, true)}
                  >
                    <Ionicons name="checkmark" size={24} color="#183771" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={() => handleUpdateStatus(comm.id, false)}
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
                <View style={styles.textContainer}>
                  <Text style={styles.text}>
                    {comm.client?.baseUser.username || "Usuario desconocido"}
                  </Text>
                  <Text style={styles.text}>Descripción: {comm.description}</Text>
                </View>
                <View style={styles.actions}>
                  <Text style={styles.responseText}>
                    {comm.status === "ACCEPTED"
                      ? "Solicitud aceptada"
                      : "Solicitud denegada"}
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </ProtectedRoute>
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
