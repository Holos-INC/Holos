import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { RootDrawerParamList } from "@/app/_layout";
import { DrawerNavigationProp } from "@react-navigation/drawer";

const ALL_WORKS = [
  {
    id: 1,
    name: "Obra 1",
    description: "Descripción de la Obra 1",
    image: "https://images.unsplash.com/photo-1506157786151-b8491531f063", // Pintura abstracta
    price: 100,
    artist: { id: 10, name: "John Doe" },
  },
  {
    id: 2,
    name: "Obra 2",
    description: "Descripción de la Obra 2",
    image: "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb", // Paisaje
    price: 200,
    artist: { id: 11, name: "Alice" },
  },
  {
    id: 3,
    name: "Obra 3",
    description: "Descripción de la Obra 3",
    image: "https://images.unsplash.com/photo-1545239351-ef35f43d514b", // Arte moderno
    price: 300,
    artist: { id: 12, name: "Bob" },
  },
  {
    id: 4,
    name: "Obra 4",
    description: "Descripción de la Obra 4",
    image: "https://images.unsplash.com/photo-1519074002996-a69e7ac46a42", // Retrato clásico
    price: 400,
    artist: { id: 13, name: "Charlie" },
  },
  {
    id: 5,
    name: "Obra 5",
    description: "Descripción de la Obra 5",
    image: "https://images.unsplash.com/photo-1521747116042-5a810fda9664", // Pintura al óleo
    price: 250,
    artist: { id: 14, name: "Diana" },
  },
  {
    id: 6,
    name: "Obra 6",
    description: "Descripción de la Obra 6",
    image: "https://images.unsplash.com/photo-1513682121497-80211f36a7d3", // Arte contemporáneo
    price: 180,
    artist: { id: 15, name: "Eve" },
  },
  {
    id: 7,
    name: "Obra 7",
    description: "Descripción de la Obra 7",
    image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93", // Arte colorido
    price: 350,
    artist: { id: 16, name: "Frank" },
  },
  {
    id: 8,
    name: "Obra 8",
    description: "Descripción de la Obra 8",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0", // Pintura minimalista
    price: 120,
    artist: { id: 17, name: "Georgia" },
  },
];

export default function WorkDetailScreen() {
  const route = useRoute();
  const { workId } = route.params as { workId: number };

  type ExploreNavProp = DrawerNavigationProp<RootDrawerParamList, "WorkDetail">;
  const navigation = useNavigation<ExploreNavProp>();

  const [work, setWork] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Para distinguir si es pantalla pequeña o grande
  const screenWidth = Dimensions.get("window").width;
  const isMobile = screenWidth < 600;

  useEffect(() => {
    const found = ALL_WORKS.find((w) => w.id === workId);
    setWork(found || null);
    setLoading(false);
  }, [workId]);

  const handleBackPress = () => {
    navigation.navigate("Inicio");
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  if (!work) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>
          No se encontró la obra con ID #{workId}.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Encabezado con flecha y texto para volver */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress}>
          <Text style={styles.backText}>← VOLVER AL INICIO</Text>
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.contentContainer,
          { flexDirection: isMobile ? "column" : "row" },
        ]}
      >
        {/* Imagen a la izquierda (o arriba en móvil) */}
        <View
          style={[styles.imageContainer, { marginRight: isMobile ? 0 : 20 }]}
        >
          {work.image ? (
            <Image source={{ uri: work.image }} style={styles.image} />
          ) : (
            // Si no hay imagen, un placeholder
            <View style={styles.placeholder}>
              <Text style={{ color: "#aaa" }}>Sin imagen</Text>
            </View>
          )}
        </View>

        {/* Info a la derecha (o debajo en móvil) */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>
            {work.name?.toUpperCase() || "TÍTULO OBRA"}
          </Text>

          <Text style={styles.label}>DESCRIPCIÓN:</Text>
          <Text style={styles.description}>
            {work.description || "Sin descripción disponible"}
          </Text>

          <Text style={styles.label}>PRECIO:</Text>
          <Text style={styles.price}>
            {work.price ? `${work.price} €` : "No disponible"}
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.messageButton}>
              <Text style={styles.messageButtonText}>MANDAR UN MENSAJE</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buyButton}
              onPress={() => {
                navigation.navigate("Payment", {
                  workId: work.id,
                  price: work.price,
                });
              }}
            >
              <Text style={styles.buyButtonText}>COMPRAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

// Estilos con paleta pastel
const styles = StyleSheet.create({
  // Contenedor principal
  container: {
    flex: 1,
    backgroundColor: "#FFF7F9", // Fondo pastel rosado muy suave
  },

  // Loader
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF7F9",
  },

  // Obra no encontrada
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF7F9",
  },
  notFoundText: {
    fontSize: 18,
    color: "#666",
  },

  // Encabezado
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#FFF7F9",
  },
  backText: {
    fontSize: 16,
    color: "#173F8A",
    fontWeight: "600",
  },

  // Layout principal
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: "flex-start",
  },

  // Imagen
  imageContainer: {
    width: "100%", // Para móvil
    maxWidth: 400, // Límite en pantallas grandes
    marginBottom: 20,
  },
  image: {
    width: "100%",
    aspectRatio: 1.2,
    resizeMode: "cover",
    borderRadius: 8,
  },
  placeholder: {
    backgroundColor: "#eee",
    width: "100%",
    aspectRatio: 1.2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },

  // Info y texto
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#173F8A",
    marginBottom: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#173F8A",
    marginTop: 14,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#4A4A4A",
    lineHeight: 20,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 6,
  },

  // Botones
  buttonRow: {
    flexDirection: "row",
    marginTop: 20,
  },
  messageButton: {
    backgroundColor: "#FFD5EB", // Rosa pastel
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  messageButtonText: {
    color: "#173F8A",
    fontSize: 14,
    fontWeight: "600",
  },
  buyButton: {
    backgroundColor: "#173F8A", // Azul fuerte para contraste
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 6,
  },
  buyButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
