import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { getAllRequestedCommissions, updateCommissionStatus } from "@/src/services/commisionApi";
import { Commission, HistoryCommisionsDTO, StatusCommission } from "@/src/constants/CommissionTypes";
import ClientCommissionsScreen from "./requested";
import { useRouter } from "expo-router";  

// 2. Ajusta la pantalla
const { width } = Dimensions.get("window");
const isBigScreen = width >= 1024;
const MOBILE_PROFILE_ICON_SIZE = 40;
const MOBILE_CARD_PADDING = 12;

export default function ArtistRequestOrders({ route, navigation }: any) {
  const { loggedInUser } = useContext(AuthenticationContext);
  const router = useRouter();  // Usamos useRouter de expo-router

  // 3. Tipar el estado como arreglo de Commission
  const [commissions, setCommissions] = useState<HistoryCommisionsDTO>({requested: [], accepted: [], history: [], error: ""});
  const [loading, setLoading] = useState(true);

  const fetchCommissions = async () => {
    try {
      const data: HistoryCommisionsDTO = await getAllRequestedCommissions(loggedInUser.token);
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
      await updateCommissionStatus(commissionId, loggedInUser.id, accept, loggedInUser.token);
      Alert.alert("Éxito", `Solicitud ${accept ? "aceptada" : "denegada"}.`);
      fetchCommissions();
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el estado de la comisión.");
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "REQUESTED":
        return "Solicitud recibida";
      case "WAITING_CLIENT":
        return "Esperando cliente";
      case "ACCEPTED":
        return "Solicitud aceptada";
      case "REJECTED":
        return "Solicitud rechazada";
      case "CANCELED":
        return "Solicitud cancelada";
      case "WAITING_ARTIST":
        return "Esperando artista";
      case "NOT_PAID_YET":
        return "No pagado aún";
      case "IN_WAIT_LIST":
        return "En lista de espera";
      case "ENDED":
        return "Finalizado";
      default:
        return "Estado desconocido";
    }
  };

  // Filtra según estado
  const newRequests = commissions.requested;
  const respondedRequests = commissions.history;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["ARTIST", "CLIENT"]}>
      <View style={styles.container}>
        
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>  {/* Usamos router.back() para retroceder */}
            <Ionicons name="arrow-back" size={24} color="#000000" />
            <Text style={styles.backButtonText}>ATRÁS</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.separator} />

        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>EN CURSO</Text>
          <ClientCommissionsScreen commissions={commissions.accepted}/>

          <View style={styles.separator} />
          
          <Text style={styles.sectionTitle}>NUEVAS SOLICITUDES</Text>
          {newRequests.length === 0 ? (
            <Text style={styles.noRequestsText}>No hay nuevas solicitudes.</Text>
          ) : (
            newRequests.map((comm) => (
              <View key={comm.id} style={styles.card}>
                <View style={styles.profileContainer}>
                  <Image 
                    source={{ uri: comm.imageProfile || "URL_DE_IMAGEN_POR_DEFECTO" }} 
                    style={styles.profileImage} 
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.textName}>
                    {comm.clientUsername || "Usuario desconocido"}
                  </Text>
                  <Text style={styles.text}>{comm.description}</Text>
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity 
                    style={styles.detailsButton} 
                    onPress={() => {/* Acción para ver detalles */}}
                  >
                    <Text style={styles.detailsButtonText}>VER DETALLE</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          <View style={styles.separator} />

          <Text style={styles.sectionTitle}>SOLICITUDES ACEPTADAS/DENEGADAS</Text>
          {respondedRequests.length === 0 ? (
            <Text style={styles.noRequestsText}>No hay solicitudes respondidas.</Text>
          ) : (
            respondedRequests.map((comm) => (
              <View key={comm.id} style={styles.card}>
                <View style={styles.profileContainer}>
                  <Image 
                    source={{ uri: comm.imageProfile || "URL_DE_IMAGEN_POR_DEFECTO" }} 
                    style={styles.profileImage} 
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.text}>
                    {comm.clientUsername || "Usuario desconocido"}
                  </Text>
                  <Text style={styles.text}>Descripción: {comm.description}</Text>
                </View>
                <View style={styles.actions}>
                  <Text style={styles.responseText}>
                    {getStatusText(comm.status)}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingLeft: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    color: "#000000",
    fontSize: 16,
    marginLeft: 8,
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
  profileContainer: {
    marginRight: 10, 
  },
  profileImage: {
    width: 40, 
    height: 40,
    borderRadius: 20, 
    backgroundColor: "#D9D9D9", 
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: 14,
    color: "#333",
  },
  textName: {
    fontSize: 17, 
    fontWeight: "bold",
    color: "#000000",
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailsButton: {
    backgroundColor: "#183771", 
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  detailsButtonText: {
    color: "#FECEF1", 
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  responseText: {
    fontSize: 14,
    color: "#183771",
    fontWeight: "bold",
  },
  separator: {
    height: 2,
    backgroundColor: "#D3D3D3", 
    marginVertical: 20, 
    marginHorizontal: 20,
  },
});
