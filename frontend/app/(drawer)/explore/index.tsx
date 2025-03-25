import React, { useState, useEffect, useMemo } from "react";
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
import { BASE_URL } from "@/src/constants/api";
import { Work } from "../../../src/constants/WorkTypes";

import {
  fetchWorksAndTransform,
  getFirstThreeArtists,
} from "../../../src/services/ExploreWorkHelpers";

export default function ExploreScreen() {
  const [works, setWorks] = useState<Work[]>([]);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const styles = isDesktop ? desktopStyles : mobileStyles;

  const [fontsLoaded] = useFonts({
    "Merriweather-Regular": require("../../../assets/fonts/Merriweather_24pt-Regular.ttf"),
    "Merriweather-Italic": require("../../../assets/fonts/Merriweather_24pt-Italic.ttf"),
    "Merriweather-Bold": require("../../../assets/fonts/Merriweather_24pt-Bold.ttf"),
    "Merriweather-BoldItalic": require("../../../assets/fonts/Merriweather_24pt-BoldItalic.ttf"),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchWorksAndTransform();
        setWorks(data);
      } catch (error) {
        console.error("Error fetching works:", error);
      }
    };

    fetchData();
  }, []);

  const firstThreeArtists = useMemo(() => getFirstThreeArtists(works), [works]);

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
                  source={{ uri: `${BASE_URL}${work.image}` }}
                  style={styles.workImage}
                />
                <View style={styles.workTextContainer}>
                  <Text style={styles.workTitle}>{work.name}</Text>
                  <Text style={styles.workArtist}>
                    {work.artist?.username ?? "Artista desconocido"}
                  </Text>
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
            {firstThreeArtists.map((artist) => (
              <TouchableOpacity
                key={artist.id}
                style={styles.artistCard}
                onPress={() =>
                  router.push({
                    pathname: "/profile/[artistId]",
                    params: { artistId: String(artist.id) },
                  })
                }
              >
                <Image
                  source={{
                    uri: `${BASE_URL}${artist.baseUser?.imageProfile}`,
                  }}
                  style={styles.artistImage}
                />
                <View style={styles.artistTextContainer}>
                  <Text style={styles.artistName}>{artist.username}</Text>
                  <Text style={styles.artistLocation}>Painter, Amsterdam</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
