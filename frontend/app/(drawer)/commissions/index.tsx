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
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { HistoryCommisionsDTO } from "@/src/constants/CommissionTypes";
import ClientCommissionsScreen from "./requested";
import { useRouter } from "expo-router";
import { getAllRequestedCommissions } from "@/src/services/commisionApi";
import { getImageSource } from "@/src/utils/getImageSource";

// 2. Ajusta la pantalla
const { width } = Dimensions.get("window");
const isBigScreen = width >= 1024;
const MOBILE_PROFILE_ICON_SIZE = 40;
const MOBILE_CARD_PADDING = 12;

export default function ArtistRequestOrders({ route, navigation }: any) {
  const { loggedInUser } = useContext(AuthenticationContext);
  const router = useRouter();

  const [commissions, setCommissions] = useState<HistoryCommisionsDTO>({
    requested: [],
    accepted: [],
    history: [],
    error: "",
  });

  const [selectedTab, setSelectedTab] = useState<
    "detalles" | "espera" | "finalizadas"
  >("detalles");
  const [loading, setLoading] = useState(true);

  const isArtist =
    Array.isArray(loggedInUser?.roles) &&
    (loggedInUser.roles.includes("ARTIST") ||
      loggedInUser.roles.includes("ARTIST_PREMIUM"));

  const isClient =
    Array.isArray(loggedInUser?.roles) && loggedInUser.roles.includes("CLIENT");

  const fetchCommissions = async () => {
    if (!loggedInUser?.token) return;

    try {
      const data: HistoryCommisionsDTO = await getAllRequestedCommissions(
        loggedInUser.token
      );
      setCommissions(data);
    } catch (error) {
      Alert.alert("Error", "Error al obtener las comisiones.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (loggedInUser?.token) {
        setLoading(true);
        fetchCommissions();
      }
    }, [loggedInUser])
  );

  const getStatusText = (status: string) => {
    switch (status) {
      case "REQUESTED":
        return "Solicitud recibida";
      case "WAITING_CLIENT":
        return "Esperando cliente";
      case "ACCEPTED":
        return "Solicitud aceptada";
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

  const newRequests = commissions?.requested || [];
  const respondedRequests = commissions?.history || [];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["ARTIST", "ARTIST_PREMIUM", "CLIENT"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#000000" />
            <Text style={styles.backButtonText}>ATRÁS</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>EN CURSO</Text>
          <ClientCommissionsScreen commissions={commissions.accepted} />

          <View style={styles.separator} />
          <View style={styles.tabButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                selectedTab === "detalles" && styles.activeTabButton,
              ]}
              onPress={() => setSelectedTab("detalles")}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  selectedTab === "detalles" && styles.activeTabButtonText,
                ]}
              >
                {isArtist ? "Nuevas solicitudes" : "Pagos pendientes"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                selectedTab === "espera" && styles.activeTabButton,
              ]}
              onPress={() => setSelectedTab("espera")}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  selectedTab === "espera" && styles.activeTabButtonText,
                ]}
              >
                Lista de Espera
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                selectedTab === "finalizadas" && styles.activeTabButton,
              ]}
              onPress={() => setSelectedTab("finalizadas")}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  selectedTab === "finalizadas" && styles.activeTabButtonText,
                ]}
              >
                Finalizadas
              </Text>
            </TouchableOpacity>
          </View>

          {/* Contenido dinámico por tab */}
          {selectedTab === "detalles" && (
            <>
              <Text style={styles.sectionTitle}>
                {isArtist ? "NUEVAS SOLICITUDES" : "PAGOS PENDIENTES"}
              </Text>
              {newRequests.length === 0 ? (
                <Text style={styles.noRequestsText}>
                  No hay nuevas solicitudes.
                </Text>
              ) : (
                newRequests.map((comm) => (
                  <View key={comm.id} style={styles.card}>
                    <View style={styles.profileContainer}>
                      <Image
                        source={getImageSource(
                          isClient
                            ? comm.imageProfileA ?? ""
                            : comm.imageProfileC ?? ""
                        )}
                        style={styles.profileImage}
                      />
                    </View>
                    <View style={styles.textContainer}>
                      <Text style={styles.textName}>
                        {isClient
                          ? comm.artistUsername || "Artista desconocido"
                          : comm.clientUsername || "Cliente desconocido"}
                      </Text>
                      <Text style={styles.text}>
                        Título: {comm.name || "Sin título"}
                      </Text>
                      <Text style={styles.text}>
                        Descripción: {comm.description}
                      </Text>
                      <Text style={styles.text}>
                        Estado de la solicitud: {getStatusText(comm.status)}
                      </Text>
                    </View>
                    <View style={styles.actions}>
                      <TouchableOpacity
                        style={styles.detailsButton}
                        onPress={() =>
                          router.push({
                            pathname: `/commissions/[commissionId]/proposal`,
                            params: { commissionId: comm.id },
                          })
                        }
                      >
                        <Text style={styles.detailsButtonText}>
                          VER DETALLE
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </>
          )}

          {selectedTab === "espera" && (
            <>
              <Text style={styles.sectionTitle}>EN LISTA DE ESPERA</Text>
              {commissions.history.filter(
                (comm) => comm.status === "IN_WAIT_LIST"
              ).length === 0 ? (
                <Text style={styles.noRequestsText}>
                  No hay comisiones en lista de espera.
                </Text>
              ) : (
                commissions.history
                  .filter((comm) => comm.status === "IN_WAIT_LIST")
                  .sort(
                    (a, b) =>
                      new Date(a.acceptedDateByArtist).getTime() -
                      new Date(b.acceptedDateByArtist).getTime()
                  )
                  .map((comm) => (
                    <View key={comm.id} style={styles.card}>
                      <View style={styles.profileContainer}>
                        <Image
                          source={getImageSource(
                            isClient
                              ? comm.imageProfileA ?? ""
                              : comm.imageProfileC ?? ""
                          )}
                          style={styles.profileImage}
                        />
                      </View>
                      <View style={styles.textContainer}>
                        <Text style={styles.textName}>
                          {isClient
                            ? comm.artistUsername || "Artista desconocido"
                            : comm.clientUsername || "Cliente desconocido"}
                        </Text>
                        <Text style={styles.text}>
                          Título: {comm.name || "Sin título"}
                        </Text>
                        <Text style={styles.text}>
                          Descripción: {comm.description}
                        </Text>
                        <Text style={styles.text}>Precio: {comm.price}€</Text>
                        <Text style={styles.text}>
                          Aceptada el:{" "}
                          {comm.acceptedDateByArtist
                            ? new Date(
                                comm.acceptedDateByArtist
                              ).toLocaleDateString("es-ES", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "Fecha desconocida"}
                        </Text>
                      </View>
                    </View>
                  ))
              )}
            </>
          )}

          {selectedTab === "finalizadas" && (
            <>
              <Text style={styles.sectionTitle}>FINALIZADAS</Text>
              {respondedRequests.length === 0 ? (
                <Text style={styles.noRequestsText}>
                  No hay solicitudes respondidas.
                </Text>
              ) : (
                respondedRequests
                  .filter((comm) => comm.status === "ENDED")
                  .map((comm) => (
                    <View key={comm.id} style={styles.card}>
                      <View style={styles.profileContainer}>
                        <Image
                          source={getImageSource(
                            isClient
                              ? comm.imageProfileA ?? ""
                              : comm.imageProfileC ?? ""
                          )}
                          style={styles.profileImage}
                        />
                      </View>
                      <View style={styles.textContainer}>
                        <Text style={styles.textName}>
                          {isClient
                            ? comm.artistUsername || "Artista desconocido"
                            : comm.clientUsername || "Cliente desconocido"}
                        </Text>
                        <Text style={styles.text}>
                          Título: {comm.name || "Sin título"}
                        </Text>
                        <Text style={styles.text}>
                          Descripción: {comm.description}
                        </Text>
                        <Text style={styles.text}>Precio: {comm.price}€</Text>
                      </View>
                      <View style={styles.actions}>
                        <TouchableOpacity
                          style={styles.detailsButton}
                          onPress={() =>
                            router.push({
                              pathname: `/commissions/[commissionId]/proposal`,
                              params: { commissionId: comm.id },
                            })
                          }
                        >
                          <Text style={styles.detailsButtonText}>
                            VER DETALLE
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.actions}>
                        <Text style={styles.responseText}>
                          {getStatusText(comm.status)}
                        </Text>
                      </View>
                    </View>
                  ))
              )}
            </>
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
    marginInlineStart: 12,
  },
  separator: {
    height: 2,
    backgroundColor: "#D3D3D3",
    marginVertical: 20,
    marginHorizontal: 20,
  },
  tabButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: "#E0E0E0",
  },
  activeTabButton: {
    backgroundColor: "#183771",
  },
  tabButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  activeTabButtonText: {
    color: "#FECEF1",
  },
});
