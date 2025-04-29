// -------------------------  ExploreScreen.tsx  -------------------------
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
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
import { WorksDoneDTO } from "@/src/constants/ExploreTypes";
import { getImageSource } from "@/src/utils/getImageSource";

export default function ExploreScreen() {
  /* ---------------------------   STATE   --------------------------- */
  const [works, setWorks] = useState<WorksDoneDTO[]>([]);
  const [topThreeArtists, setTopThreeArtists] = useState<ArtistMin[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  /* ------------------------   HOOKS & HELPERS   ------------------------ */
  const { loggedInUser } = useAuth();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const styles = isDesktop ? desktopStyles : mobileStyles;

  // grid helpers for paginated works list
  const numColumns = isDesktop ? 3 : width > 500 ? 2 : 1;
  const margin = isDesktop ? 24 : 12;
  const cardWidth = (width - (numColumns + 1) * margin) / numColumns;

  // pagination helpers
  const PAGE_SIZE = 9;
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(works.length / PAGE_SIZE);
  const paginatedWorks = works.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  /* ---------------------------   FONTS   --------------------------- */
  const [fontsLoaded] = useFonts({
    "Merriweather-Regular": require("../../assets/fonts/Merriweather_24pt-Regular.ttf"),
    "Merriweather-Italic": require("../../assets/fonts/Merriweather_24pt-Italic.ttf"),
    "Merriweather-Bold": require("../../assets/fonts/Merriweather_24pt-Bold.ttf"),
    "Merriweather-BoldItalic": require("../../assets/fonts/Merriweather_24pt-BoldItalic.ttf"),
  });

  /* ---------------------------   DATA   --------------------------- */
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

  // reset pagination when works change
  useEffect(() => setPage(0), [works]);

  /* ------------------------   HANDLERS   ------------------------ */
  const handleNextPage = () => setPage((p) => Math.min(p + 1, totalPages - 1));
  const handlePrevPage = () => setPage((p) => Math.max(p - 1, 0));
  const handleSearchSubmit = () => {
    if (searchQuery.trim()) setIsSearching(true);
  };
  const closeSearch = () => setIsSearching(false);

  /* ------------------------   RENDERERS   ------------------------ */
  const renderWorkItem = ({ item }: { item: WorksDoneDTO }) => (
    <TouchableOpacity
      style={[styles.workItem, { width: cardWidth, margin }]}
      onPress={() =>
        router.push({
          pathname: "/work/[workId]",
          params: { workId: String(item.id) },
        })
      }
    >
      <Image source={getImageSource(item.image)} style={styles.workImage} />
      <View style={styles.workTextContainer}>
        <Text style={styles.workTitle}>{item.name}</Text>
        <Text style={styles.workArtist}>{item.artistName}</Text>
        <Text style={styles.workSubtitle}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  /**
   * Footer with pagination controls (chevrons) + Featured Artists section.
   * This way the artist list siempre aparece al final de la lista de obras
   * y hereda el scroll del FlatList.
   */
  const renderListFooter = () => (
    <>
      {/* ------------ Pagination ------------ */}
      {totalPages > 1 && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            onPress={handlePrevPage}
            disabled={page === 0}
            style={[
              styles.paginationButton,
              page === 0 && styles.paginationDisabled,
            ]}
          >
            <Ionicons name="chevron-back" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNextPage}
            disabled={page === totalPages - 1}
            style={[
              styles.paginationButton,
              page === totalPages - 1 && styles.paginationDisabled,
            ]}
          >
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      )}

      {/* ------------ Featured artists ------------ */}
      <View style={styles.bottomSection}>
        <View style={styles.bottomSectionHeader}>
          <Text style={styles.bottomSectionHeaderText}>
            ARTISTAS DESTACADOS
          </Text>
        </View>
        <View style={styles.artistsContainer}>
          {topThreeArtists.map((artist) => (
            <TouchableOpacity
              key={artist.id}
              style={styles.artistCard}
              onPress={() => router.push(`/profile/${artist.username}`)}
            >
              <Image
                source={getImageSource(artist.imageProfile || "")}
                style={styles.artistImage}
              />
              <View style={styles.artistTextContainer}>
                <Text style={styles.artistName}>{artist.name}</Text>
                {artist.location && (
                  <Text style={styles.artistLocation}>{artist.location}</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );

  /* ---------------------------   MAIN JSX   --------------------------- */
  if (!fontsLoaded) return null;

  return (
    <TouchableWithoutFeedback onPress={closeSearch}>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        {/* -------------------- Search bar -------------------- */}
        <TextInput
          style={[styles.searchBar, { marginTop: isDesktop ? 50 : 25 }]}
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
            {/* -------------------- Obras header -------------------- */}
            <View style={styles.topSection}>
              <Text style={styles.topSectionText}>Obras</Text>
            </View>

            {/* -------------------- Works list -------------------- */}
            <FlatList
              data={paginatedWorks}
              key={numColumns} // force re‑render cuando cambia numColumns
              keyExtractor={(item) => item.id.toString()}
              numColumns={numColumns}
              renderItem={renderWorkItem}
              contentContainerStyle={styles.worksContainer}
              ListFooterComponent={renderListFooter}
            />
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
