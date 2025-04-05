
import React, { useState, useEffect, useMemo } from "react";
import { Text, ScrollView, View, Image, TouchableOpacity, LayoutChangeEvent, NativeSyntheticEvent, NativeScrollEvent, TouchableWithoutFeedback   } from "react-native";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";6
import { styles } from "@/src/styles/Explore.styles";
import { BASE_URL } from "@/src/constants/api";
import { WorksDoneDTO } from "../../../src/constants/ExploreTypes";
import { getFirstThreeArtists } from "../../../src/services/ExploreWorkHelpers";
import WorkCard from "@/src/components/explore/WorkCard";
import { fetchWorksDone } from "@/src/services/WorksDoneApi";

export default function ExploreScreen() {
  const [works, setWorks] = useState<WorksDoneDTO[]>([]);
  const [menuVisibleId, setMenuVisibleId] = useState<number | null>(null);
  const router = useRouter();
  // const { width } = useWindowDimensions();
  // const isDesktop = width > 768;
  // const styles = desktopStyles;

  const [fontsLoaded] = useFonts({
    "Merriweather-Regular": require("../../../assets/fonts/Merriweather_24pt-Regular.ttf"),
    "Merriweather-Italic": require("../../../assets/fonts/Merriweather_24pt-Italic.ttf"),
    "Merriweather-Bold": require("../../../assets/fonts/Merriweather_24pt-Bold.ttf"),
    "Merriweather-BoldItalic": require("../../../assets/fonts/Merriweather_24pt-BoldItalic.ttf"),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const works = await fetchWorksDone();
        setWorks(works);
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

    <TouchableWithoutFeedback onPress={() => {
      if (menuVisibleId !== null) {
        setMenuVisibleId(null); // Cierra el menú al tocar fuera
      }
    }}>

   
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>

        {/* Sección superior */}
        <View style={styles.topSection}>
          <Text style={styles.topSectionText}>Obras</Text>
        </View>

        {/* Sección del medio: Obras */}
        <View style={styles.middleSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {works.map((work) => (
              <WorkCard
                key={work.id}
                work={work}
                menuVisibleId={menuVisibleId}
                setMenuVisibleId={setMenuVisibleId}
              />
            ))}
          </ScrollView>
        </View>

        {/* Sección inferior: Artistas */}
        <View style={styles.bottomSection}>
          <View style={styles.bottomSectionHeader}>
            <Text style={styles.bottomSectionHeaderText}>ARTISTAS</Text>
          </View>
          <View style={styles.artistsContainer}>
          {/* {firstThreeArtists.map((artist:any) => (
            <View key={artist.id}>
              <TouchableOpacity
                style={styles.artistCard}
                onPress={() => router.push({ pathname: "/profile/[artistId]", params: { artistId: String(artist.id) }})}
              >
                <Image
                  source={{ uri: `${BASE_URL}${artist.baseUser?.imageProfile}`}}
                  style={styles.artistImage}
                />
                <View style={styles.artistTextContainer}>
                  <Text style={styles.artistName}>{artist.username}</Text>
                </View>
              </TouchableOpacity>
            </View>
          ))} */}
          </View>
        </View>
      </View>
    </ScrollView>
    </TouchableWithoutFeedback>
  );
}