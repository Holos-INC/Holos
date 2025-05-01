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
import { mobileStyles, desktopStyles } from "@/src/styles/WorkDetail.styles";
import { useFonts } from "expo-font";
import { getImageSource } from "@/src/utils/getImageSource";
import { getCommissionDoneById } from "@/src/services/commisionApi";
import { CommissionDTO } from "@/src/constants/CommissionTypes";

export default function WorkDetailScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { commissionId } = useLocalSearchParams();

  const [commission, setCommission] = useState<CommissionDTO | null>(null);
  const [loading, setLoading] = useState(true);

  const { width } = useWindowDimensions();
  const styles = width > 768 ? desktopStyles : mobileStyles;

  const [menuVisibleId, setMenuVisibleId] = useState<number | null>(null);

  const [fontsLoaded] = useFonts({
    "Merriweather-Regular": require("../../../../assets/fonts/Merriweather_24pt-Regular.ttf"),
    "Merriweather-Italic": require("../../../../assets/fonts/Merriweather_24pt-Italic.ttf"),
    "Merriweather-Bold": require("../../../../assets/fonts/Merriweather_24pt-Bold.ttf"),
    "Merriweather-BoldItalic": require("../../../../assets/fonts/Merriweather_24pt-BoldItalic.ttf"),
  });

  useEffect(() => {
    const fetchWork = async () => {
      try {
        const data = (await getCommissionDoneById(
          Number(commissionId)
        )) as CommissionDTO;
        setCommission(data);
      } catch (error) {
        console.error("Error fetching work details:", error);
        setCommission(null);
      } finally {
        setLoading(false);
      }
    };
    fetchWork();
  }, [commissionId]);

  useEffect(() => {
    navigation.setOptions({ title: commission?.name || "Detalle de obra" });
  }, [navigation, commission]);

  if (loading || !fontsLoaded) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  if (!commission) {
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
          {commission.image ? (
            <Image
              source={getImageSource(commission.image)}
              style={styles.imageStyle}
              onError={() =>
                console.log("Error cargando imagen:", commission.image)
              }
            />
          ) : (
            <View style={styles.placeholderContainer}>
              <Text>Sin imagen</Text>
            </View>
          )}
        </View>

        <ScrollView style={styles.rightColumn}>
          <TouchableOpacity
            onPress={() => router.push(`/`)}
            style={styles.backButton}
          >
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backText}>ATRÁS</Text>
          </TouchableOpacity>

          <View style={styles.informationContainer}>
            <Text style={styles.title}>
              {commission.name ? commission.name.toUpperCase() : "TÍTULO OBRA"}
            </Text>

            <Text
              onPress={() => {
                if (commission.artistUsername) {
                  router.push(`/profile/${commission.artistUsername}`);
                } else {
                  console.warn("No se encontró el artista");
                }
              }}
              style={styles.artistText}
            >
              {commission.artistUsername || "Artista desconocido"}
            </Text>

            <Text style={styles.infoText}>
              {commission.description || "Sin descripción disponible"}
            </Text>

            <View style={styles.separator} />

            <View style={styles.priceRow}>
              <Text style={styles.price}>
                {commission.price ? `${commission.price} €` : "No disponible"}
              </Text>
            </View>
            <Text style={styles.price}>
              {commission.status ? `${commission.status} €` : "No disponible"}
            </Text>
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}
