import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from "react-native";
import { useNavigation, useLocalSearchParams, useRouter } from "expo-router";

import { getWorksDoneById } from "@/src/services/WorksDoneApi";
import { BASE_URL } from "@/src/constants/api";
import { WorksDoneDTO } from "@/src/constants/ExploreTypes";
import { mobileStyles, desktopStyles } from "@/src/styles/WorkDetail.styles";

import { useFonts } from "expo-font";

export default function WorkDetailScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { workId } = useLocalSearchParams();

  const [work, setWork] = useState<WorksDoneDTO | null>(null);
  const [loading, setLoading] = useState(true);

  const { width } = useWindowDimensions();
  const styles = width > 768 ? desktopStyles : mobileStyles;

  /* ---- Fuentes Merriweather ---- */
  const [fontsLoaded] = useFonts({
    "Merriweather-Regular": require("../../../assets/fonts/Merriweather_24pt-Regular.ttf"),
    "Merriweather-Italic": require("../../../assets/fonts/Merriweather_24pt-Italic.ttf"),
    "Merriweather-Bold": require("../../../assets/fonts/Merriweather_24pt-Bold.ttf"),
    "Merriweather-BoldItalic": require("../../../assets/fonts/Merriweather_24pt-BoldItalic.ttf"),
  });

  /* ---- Traer la obra ---- */
  useEffect(() => {
    const fetchWork = async () => {
      try {
        const data = (await getWorksDoneById(Number(workId))) as WorksDoneDTO;
        setWork(data);
      } catch (error) {
        console.error("Error fetching work details:", error);
        setWork(null);
      } finally {
        setLoading(false);
      }
    };
    fetchWork();
  }, [workId]);

  /* ---- Título en la barra ---- */
  useEffect(() => {
    navigation.setOptions({ title: work?.name || "Detalle de obra" });
  }, [navigation, work]);

  /* ---- Cargando / No encontrada ---- */
  if (loading || !fontsLoaded) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  if (!work) {
    return (
      <View style={styles.notFoundContainer}>
        <Text>No se encontró la obra</Text>
      </View>
    );
  }

  /* ---- Helper imagen base64 o path ---- */
  const isBase64Path = (base64: string): boolean => {
    try {
      const decoded = atob(base64);
      return decoded.startsWith("/images/");
    } catch {
      return false;
    }
  };

  /* ---- Render ---- */
  return (
    <TouchableWithoutFeedback>
      <View style={styles.container}>
        {/* ---------- Columna izquierda: imagen ---------- */}
        <View style={styles.leftColumn}>
          {work.image ? (
            <Image
              source={{
                uri: isBase64Path(work.image)
                  ? `${BASE_URL}${atob(work.image)}`
                  : `data:image/jpeg;base64,${work.image}`,
              }}
              style={styles.imageStyle}
              onError={() => console.log("Error cargando imagen:", work.image)}
            />
          ) : (
            <View style={styles.placeholderContainer}>
              <Text>Sin imagen</Text>
            </View>
          )}
        </View>

        {/* ---------- Columna derecha: información ---------- */}
        <ScrollView style={styles.rightColumn}>
          {/* Botón atrás */}
          <TouchableOpacity
            onPress={() => router.push(`/`)}
            style={styles.backButton}
          >
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backText}>ATRÁS</Text>
          </TouchableOpacity>

          <View style={styles.informationContainer}>
            {/* Título */}
            <Text style={styles.title}>
              {work.name ? work.name.toUpperCase() : "TÍTULO OBRA"}
            </Text>

            {/* Artista */}
            <Text
              onPress={() => {
                if (work.artistId) {
                  router.push(`/profile/${work.artistSurname}`);
                } else {
                  console.warn("No se encontró el artista");
                }
              }}
              style={styles.artistText}
            >
              {work.artistSurname || "Artista desconocido"}
            </Text>

            {/* Descripción */}
            <Text style={styles.infoText}>
              {work.description || "Sin descripción disponible"}
            </Text>

            <View style={styles.separator} />

            {/* Precio + Botón Reportar */}
            <View style={styles.priceRow}>
              <Text style={styles.price}>
                {work.price ? `${work.price} €` : "No disponible"}
              </Text>

              <TouchableOpacity
                style={styles.reportButton}
                onPress={() =>
                  router.push({
                    pathname: "/report/[reportId]",
                    params: { reportId: String(work.id) },
                  })
                }
              >
                <Text style={styles.reportButtonText}>Reportar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}
