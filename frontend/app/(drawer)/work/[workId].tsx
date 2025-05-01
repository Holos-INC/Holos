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
import { useAuth } from "@/src/hooks/useAuth";
import { getWorksDoneById } from "@/src/services/WorksDoneApi";
import { WorksDoneDTO } from "@/src/constants/ExploreTypes";
import { mobileStyles, desktopStyles } from "@/src/styles/WorkDetail.styles";
import { useFonts } from "expo-font";
import { getImageSource } from "@/src/utils/getImageSource";
import ReportDropdown from "@/src/components/report/ReportDropDown";
import { deleteWorksDone } from "@/src/services/WorksDoneApi";

export default function WorkDetailScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { workId } = useLocalSearchParams();
  const { loggedInUser } = useAuth();

  const [work, setWork] = useState<WorksDoneDTO | null>(null);
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

  useEffect(() => {
    navigation.setOptions({ title: work?.name || "Detalle de obra" });
  }, [navigation, work]);

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

  return (
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
              source={getImageSource(work.image)}
              style={styles.imageStyle}
              onError={() => console.log("Error cargando imagen:", work.image)}
            />
          ) : (
            <View style={styles.placeholderContainer}>
              <Text>Sin imagen</Text>
            </View>
          )}
        </View>

        <ScrollView style={styles.rightColumn}>
          <TouchableOpacity
            onPress={() => router.back()}
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

            <Text style={styles.infoText}>
              {work.description || "Sin descripción disponible"}
            </Text>

            <View style={styles.separator} />

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
              {/*Boton para eliminar una obra si es mia*/}
              {work.baseUserId == loggedInUser.id && (
                <TouchableOpacity
                  style={styles.reportButton}
                  onPress={async () => {
                    try {
                      await deleteWorksDone(work.id);
                      console.log("Obra eliminada exitosamente");
                      router.back();
                      } catch (error) {
                      console.error("Error al eliminar la obra:", error);
                      }
                  }}
                >
                  <Text style={styles.reportButtonText}>Eliminar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}
