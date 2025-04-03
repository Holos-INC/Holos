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
import { getWorksDoneById } from "@/src/services/WorksDoneApi";
import { useNavigation, useLocalSearchParams, useRouter } from "expo-router";
import { BASE_URL } from "@/src/constants/api";
import { useFonts } from "expo-font";
import { Work } from "@/src/constants/ExploreTypes";
import { mobileStyles, desktopStyles } from "@/src/styles/WorkDetail.styles";

// >>> Importa el componente que muestra el menú de reporte <<<
import ReportDropdown from "@/src/components/report/ReportDropDown";

export default function WorkDetailScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { workId } = useLocalSearchParams();
  const [work, setWork] = useState<Work | null>(null);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();
  const styles = width > 768 ? desktopStyles : mobileStyles;

  // >>> Estado para controlar el menú de reporte <<<
  const [menuVisibleId, setMenuVisibleId] = useState<number | null>(null);

  const [fontsLoaded] = useFonts({
    "Merriweather-Regular": require("../../../assets/fonts/Merriweather_24pt-Regular.ttf"),
    "Merriweather-Italic": require("../../../assets/fonts/Merriweather_24pt-Italic.ttf"),
    "Merriweather-Bold": require("../../../assets/fonts/Merriweather_24pt-Bold.ttf"),
    "Merriweather-BoldItalic": require("../../../assets/fonts/Merriweather_24pt-BoldItalic.ttf"),
  });

  useEffect(() => {
    const fetchWork = async () => {
      try {
        const data = (await getWorksDoneById(Number(workId))) as Work;
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

  useEffect(() => {
    navigation.setOptions({ title: work?.name || "Detalle de obra" });
  }, [navigation, work]);

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
        <Text>No se encontró la obra</Text>
      </View>
    );
  }

  return (
    // >>> Usamos un TouchableWithoutFeedback para poder cerrar el menú al pulsar fuera <<<
    <TouchableWithoutFeedback
      onPress={() => {
        if (menuVisibleId !== null) {
          setMenuVisibleId(null);
        }
      }}
    >
      <View style={styles.container}>
        <View style={styles.leftColumn}>
          {work.image ? (
            <Image
              source={{ uri: `${BASE_URL}${atob(work?.image)}` }}
              style={styles.imageStyle}
            />
          ) : (
            <View style={styles.placeholderContainer}>
              <Text>Sin imagen</Text>
            </View>
          )}

          {/* >>> Aquí se muestra el botón/desplegable de reporte <<< */}
          {work.image && (
            <View style={{ position: "absolute", top: 10, right: 10 }}>
              <ReportDropdown
                workId={work.id}
                menuVisibleId={menuVisibleId}
                setMenuVisibleId={setMenuVisibleId}
                isBigScreen={width > 768}
              />
            </View>
          )}
        </View>

        <ScrollView style={styles.rightColumn}>
          <TouchableOpacity
            onPress={() => router.push(`/explore`)}
            style={styles.backButton}
          >
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backText}>ATRÁS</Text>
          </TouchableOpacity>

          <View style={styles.informationContainer}>
            <Text style={styles.title}>
              {work.name ? work.name.toUpperCase() : "TÍTULO OBRA"}
            </Text>

            <Text
              onPress={() => {
                if (work.artist && work.artist.id) {
                  router.push(`/profile/${work.artist.id}`);
                } else {
                  console.warn("No se encontró el artista");
                }
              }}
              style={styles.artistText}
            >
              {work.artist.baseUser?.username || "Artista desconocido"}
            </Text>

            <Text style={styles.infoText}>
              {work.description || "Sin descripción disponible"}
            </Text>

            <View style={styles.separator} />
            <Text style={styles.price}>
              {work.price ? `${work.price} €` : "No disponible"}
            </Text>
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}
