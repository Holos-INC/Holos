import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";

import { desktopStyles, mobileStyles } from "@/src/styles/Explore.styles";
import SearchScreen from "@/src/components/search/SearchScreen";
import { useAuth } from "@/src/hooks/useAuth";

import {
  fetchWorksAndTransform,
  getTopThreeArtists,
  ArtistMin,
} from "@/src/services/ExploreWorkHelpers";

// Re-exported from wherever you define your API root
import { BASE_URL } from "@/src/constants/api";

import { WorksDoneDTO } from "@/src/constants/ExploreTypes";

export default function ExploreScreen() {
  /* ---------- estado ---------- */
  const [works, setWorks] = useState<WorksDoneDTO[]>([]);
  const [topThreeArtists, setTopThreeArtists] = useState<ArtistMin[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  /* ---------- helpers ---------- */
  const { loggedInUser } = useAuth();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const styles = isDesktop ? desktopStyles : mobileStyles;

  const isBase64Path = (base64: string): boolean => {
    try {
      const decoded = atob(base64);
      return decoded.startsWith("/images/");
    } catch (e) {
      return false;
    }
  };

  /* ---------- fonts ---------- */
  const [fontsLoaded] = useFonts({
    "Merriweather-Regular": require("../../assets/fonts/Merriweather_24pt-Regular.ttf"),
    "Merriweather-Italic": require("../../assets/fonts/Merriweather_24pt-Italic.ttf"),
    "Merriweather-Bold": require("../../assets/fonts/Merriweather_24pt-Bold.ttf"),
    "Merriweather-BoldItalic": require("../../assets/fonts/Merriweather_24pt-BoldItalic.ttf"),
  });

  /* ---------- fetch data ---------- */
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchWorksAndTransform(loggedInUser?.token);
        setWorks(data);
      } catch (err) {
        console.error("Error fetching works:", err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const artists = await getTopThreeArtists();
        setTopThreeArtists(artists);
      } catch (err) {
        console.error("Error fetching artists:", err);
      }
    })();
  }, []);

  if (!fontsLoaded) return null;

  /* ---------- búsqueda ---------- */
  const handleSearchSubmit = () => {
    if (searchQuery.trim()) setIsSearching(true);
  };

  const closeSearch = () => setIsSearching(false);

  /* ---------- helpers ---------- */
  const buildImageSource = (raw: string) => ({
    uri: isBase64Path(raw)
      ? `${BASE_URL}${atob(raw)}` // path viene en base64 → decodificamos y pegamos la URL absoluta
      : `data:image/jpeg;base64,${raw}`, // es la imagen completa en base64 → incrustamos directamente
  });

  /* ---------- render ---------- */
  return (
    <TouchableWithoutFeedback onPress={closeSearch}>
      <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={styles.container}>
          {/* barra de búsqueda */}
          <TextInput
            style={[
              styles.searchBar,
              { marginTop: isDesktop ? 50 : 25 }, // coherencia con layout
            ]}
            placeholder="Buscar trabajos o artistas…"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />

          {isSearching ? (
            <SearchScreen query={searchQuery} />
          ) : (
            <>
              {/* sección superior */}
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

              {/* obras */}
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
                          pathname: "/work/[workId]", // dinámica → /work/123
                          params: { workId: String(work.id) },
                        })
                      }
                    >
                      <Image
                        source={buildImageSource(work.image)}
                        style={styles.workImage}
                        onError={() =>
                          console.log("Error cargando imagen:", work.image)
                        }
                      />
                      <View style={styles.workTextContainer}>
                        <Text style={styles.workTitle}>{work.name}</Text>
                        <Text style={styles.workArtist}>{work.artistName}</Text>
                        <Text style={styles.workSubtitle}>
                          {work.description}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* artistas */}
              <View style={styles.bottomSection}>
                <View style={styles.bottomSectionHeader}>
                  <Text style={styles.bottomSectionHeaderText}>ARTISTAS</Text>
                </View>
                <View style={styles.artistsContainer}>
                  {topThreeArtists.map((artist) => (
                    <TouchableOpacity
                      key={artist.id}
                      style={styles.artistCard}
                      onPress={() => router.push(`/profile/${artist.username}`)}
                    >
                      <Image
                        source={buildImageSource(artist.imageProfile || "")}
                        style={styles.artistImage}
                        onError={() =>
                          console.log(
                            "Error cargando imagen:",
                            artist.imageProfile
                          )
                        }
                      />
                      <View style={styles.artistTextContainer}>
                        <Text style={styles.artistName}>{artist.name}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}
