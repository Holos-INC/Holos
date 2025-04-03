
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Image, ScrollView, Dimensions, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions} from "react-native";
import { getWorksDoneById } from "@/src/services/WorksDoneApi";
import { useNavigation, useLocalSearchParams, useRouter } from "expo-router";
import { BASE_URL } from "@/src/constants/api";
import { useFonts } from "expo-font";
import { Work } from "@/src/constants/WorkTypes";
import { mobileStyles, desktopStyles } from "@/src/styles/WorkInfo.styles";
import ReportDropdown from "@/src/components/report/ReportDropDown";
import { BaseUser } from "@/src/constants/ExploreTypes";
import { WorksDone } from "@/src/constants/CommissionTypes";

export default function WorkDetailScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { workId } = useLocalSearchParams();
  const [work, setWork] = useState<WorksDone | null>(null);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();
  const styles = width > 768 ? desktopStyles : mobileStyles;

  const [fontsLoaded] = useFonts({
    "Merriweather-Regular": require("../../../assets/fonts/Merriweather_24pt-Regular.ttf"),
    "Merriweather-Italic": require("../../../assets/fonts/Merriweather_24pt-Italic.ttf"),
    "Merriweather-Bold": require("../../../assets/fonts/Merriweather_24pt-Bold.ttf"),
    "Merriweather-BoldItalic": require("../../../assets/fonts/Merriweather_24pt-BoldItalic.ttf"),
  });

  const [menuVisibleId, setMenuVisibleId] = useState<number | null>(null);


  useEffect(() => {
    const fetchWork = async () => {
      try {
        const data = (await getWorksDoneById(Number(workId))) as WorksDone;
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
    <TouchableWithoutFeedback onPress={() => {
      if (menuVisibleId !== null) {
        setMenuVisibleId(null); // Cierra el menú al tocar fuera
      }
    }}>

      <ScrollView
        style={staticStyles.container}
        contentContainerStyle={dynamicStyles.scrollContent}
      >


        <View style={dynamicStyles.contentContainer}>

          <View style={[dynamicStyles.imageContainer, { position: "relative" }]}>

            {work.image ? (

              <Image
                source={{ uri: `${BASE_URL}${atob(work.image)}` }}
                style={dynamicStyles.image}
              />
            ) : (
              <View style={staticStyles.placeholder}>
                <Text style={{ color: "#aaa" }}>Sin imagen</Text>
              </View>
            )}
            {work.image && (
              <View style={staticStyles.reportDropdownContatiner}>
                <ReportDropdown workId={work.id} menuVisibleId={menuVisibleId} setMenuVisibleId={setMenuVisibleId} isBigScreen={false} />
              </View>
            )}

          </View>

          <View style={staticStyles.infoContainer}>
            <Text style={staticStyles.title}>
              {work.name ? work.name.toUpperCase() : "TÍTULO OBRA"}
            </Text>

            <Text style={dynamicStyles.label}>ARTISTA:</Text>
            <TouchableOpacity
              onPress={() => {
                if (work.artist && work.artist.id) {
                  router.push(`/profile/${work.artist.id}`);
                } else {
                  console.warn("No se encontró el artista");
                }
              }}
            >
              <Text style={dynamicStyles.artistName}>
                {work.artist?.baseUser?.username || "Artista desconocido"}
              </Text>
            </TouchableOpacity>
            <Text style={dynamicStyles.label}>DESCRIPCIÓN:</Text>
            <Text style={dynamicStyles.description}>
              {work.description || "Sin descripción disponible"}
            </Text>
            <Text style={staticStyles.label}>PRECIO:</Text>

            <Text style={staticStyles.price}>
              {work.price ? `${work.price} €` : "No disponible"}
            </Text>
          </View>
        </View>

      </ScrollView>
    </TouchableWithoutFeedback>
  );
}
