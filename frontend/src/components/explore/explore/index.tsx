// src/screens/ExploreScreen.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";

import { desktopStyles, mobileStyles } from "@/src/styles/Explore.styles";
import ReportDropdown from "@/src/components/report/ReportDropDown";

import {
  fetchWorksAndTransform,
  getTopThreeArtists,
  decodeImagePath,
  ArtistMin,
} from "@/src/services/ExploreWorkHelpers";
import { WorksDoneDTO } from "@/src/constants/ExploreTypes";
import { useAuth } from "@/src/hooks/useAuth";

export default function ExploreScreen() {
  const [works, setWorks] = useState<WorksDoneDTO[]>([]);
  const { loggedInUser } = useAuth();
  // Guardamos en este estado los tres artistas obtenidos de la nueva API.
  const [topThreeArtists, setTopThreeArtists] = useState<ArtistMin[]>([]);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const styles = isDesktop ? desktopStyles : mobileStyles;
  const [menuVisibleId, setMenuVisibleId] = useState<number | null>(null);

  const [fontsLoaded] = useFonts({
    "Merriweather-Regular": require("../../../assets/fonts/Merriweather_24pt-Regular.ttf"),
    "Merriweather-Italic": require("../../../assets/fonts/Merriweather_24pt-Italic.ttf"),
    "Merriweather-Bold": require("../../../assets/fonts/Merriweather_24pt-Bold.ttf"),
    "Merriweather-BoldItalic": require("../../../assets/fonts/Merriweather_24pt-BoldItalic.ttf"),
  });

  // Llamada a la API para obtener las obras (sección intermedia)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchWorksAndTransform(loggedInUser.token);
        setWorks(data);
      } catch (error) {
        console.error("Error fetching works:", error);
      }
    };
    fetchData();
  }, []);

  // Llamada a la nueva API para obtener los tres artistas con más publicaciones
  useEffect(() => {
    const fetchTopArtists = async () => {
      try {
        const artists = await getTopThreeArtists();
        setTopThreeArtists(artists);
        console.log("Top three artists:", artists);
      } catch (error) {
        console.error("Error fetching top three artists:", error);
      }
    };
    fetchTopArtists();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        {/* Sección superior */}
        <View style={styles.topSection}>
          <Text style={styles.topSectionText}>Obras</Text>
          <View style={styles.topSectionRight}>
            <Text style={styles.topSectionSecondText}>Desliza</Text>
            <Ionicons
              name="arrow-forward"
              size={20}
              color="#666"
              style={{ marginLeft: 4 }}
            />
          </View>
        </View>

        {/* Sección del medio: Obras */}
        <View style={styles.middleSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.worksScrollContainer}
          >
            {works.map((work) => (
              <TouchableOpacity
                key={work.id}
                style={styles.workItem}
                onPress={() =>
                  router.push({
                    pathname: "/work/[workId]",
                    params: { workId: String(work.id) },
                  })
                }
              >
                <Image
                  source={{ uri: decodeImagePath(work.image) }}
                  style={styles.workImage}
                />
                <View style={styles.workTextContainer}>
                  <Text style={styles.workTitle}>{work.name}</Text>
                  <Text style={styles.workArtist}>{work.artistName}</Text>
                  <Text style={styles.workSubtitle}>{work.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Sección inferior: Artistas */}
        <View style={styles.bottomSection}>
          <View style={styles.bottomSectionHeader}>
            <Text style={styles.bottomSectionHeaderText}>ARTISTAS</Text>
          </View>
          <View style={styles.artistsContainer}>
            {topThreeArtists.map((artist) => {
              // Usamos directamente artist.imageProfile para obtener la URI de la imagen
              const imageUri = artist.imageProfile
                ? decodeImagePath(artist.imageProfile)
                : undefined;
              return (
                <TouchableOpacity
                  key={artist.id}
                  style={styles.artistCard}
                  onPress={() => router.push(`/profile/${artist.id}`)}
                >
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.artistImage}
                  />
                  <View style={styles.artistTextContainer}>
                    <Text style={styles.artistName}>{artist.name}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
