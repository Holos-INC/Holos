import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Icon } from "react-native-paper";
import { useRouter } from "expo-router";

import { BASE_URL } from "@/src/constants/api";
import {
  mobileStyles as searchMobileStyles,
  desktopStyles as searchDesktopStyles,
} from "@/src/styles/Search.styles";
import { Artist, SearchWorkDTO } from "@/src/constants/ExploreTypes";
import colors from "@/src/constants/colors";

interface Props {
  query: string;
}

const WORKS_PAGE_SIZE = 9;
const ARTISTS_PAGE_SIZE = 3;

const SearchScreen = ({ query }: Props) => {
  const [works, setWorks] = useState<SearchWorkDTO[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);

  const [workPage, setWorkPage] = useState(0);
  const [artistPage, setArtistPage] = useState(0);

  const router = useRouter();

  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const styles = isDesktop ? searchDesktopStyles : searchMobileStyles;

  const numColumns = isDesktop ? 3 : width > 500 ? 2 : 1;
  const margin = isDesktop ? 24 : 12;
  const cardWidth = (width - (numColumns + 1) * margin) / numColumns;

  useEffect(() => {
    (async () => {
      try {
        const worksRes = await fetch(
          `${BASE_URL}/api/v1/search/works?query=${encodeURIComponent(
            query || ""
          )}`
        ).then((r) => r.json());
        setWorks(worksRes.content || []);

        const artistsRes = await fetch(
          `${BASE_URL}/api/v1/search/artists?query=${encodeURIComponent(
            query || ""
          )}`
        ).then((r) => r.json());
        setArtists(artistsRes.content || []);
      } catch (err) {
        console.error("Error fetching search:", err);
      }
    })();
  }, [query]);

  useEffect(() => {
    setWorkPage(0);
    setArtistPage(0);
  }, [works, artists, query]);

  const isBase64Path = (b64: string) => {
    try {
      return atob(b64).startsWith("/images/");
    } catch {
      return false;
    }
  };

  const workImageSource = (image: string) => ({
    uri:
      image && isBase64Path(image)
        ? `${BASE_URL}${atob(image)}`
        : `data:image/jpeg;base64,${image}`,
  });

  const artistImageSource = (image?: string) => ({
    uri:
      image && isBase64Path(image)
        ? `${BASE_URL}${atob(image)}`
        : `data:image/jpeg;base64,${image}`,
  });

  /* ------------ Works Pagination ------------ */
  const workTotalPages = Math.ceil(works.length / WORKS_PAGE_SIZE);
  const paginatedWorks = works.slice(
    workPage * WORKS_PAGE_SIZE,
    (workPage + 1) * WORKS_PAGE_SIZE
  );

  const handleNextWorkPage = () =>
    setWorkPage((p) => Math.min(p + 1, workTotalPages - 1));
  const handlePrevWorkPage = () => setWorkPage((p) => Math.max(p - 1, 0));

  /* ------------ Artists Pagination ------------ */
  const artistTotalPages = Math.ceil(artists.length / ARTISTS_PAGE_SIZE);
  const paginatedArtists = artists.slice(
    artistPage * ARTISTS_PAGE_SIZE,
    (artistPage + 1) * ARTISTS_PAGE_SIZE
  );

  const handleNextArtistPage = () =>
    setArtistPage((p) => Math.min(p + 1, artistTotalPages - 1));
  const handlePrevArtistPage = () => setArtistPage((p) => Math.max(p - 1, 0));

  /* ------------- renderers ---------------- */
  const renderWorkItem = ({ item }: { item: SearchWorkDTO }) => (
    <TouchableOpacity
      style={[styles.workItem, { width: cardWidth, margin }]}
      onPress={() =>
        router.push({
          pathname: "/work/[workId]",
          params: { workId: String(item.id) },
        })
      }
    >
      <Image source={workImageSource(item.image)} style={styles.workImage} />
      <View style={styles.workTextContainer}>
        <Text style={styles.workTitle}>{item.name}</Text>
        <Text style={styles.workArtist}>
          por @{item.artistUsername ?? "Desconocido"}
        </Text>
        <Text style={styles.workSubtitle}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderWorksSection = () =>
    works.length > 0 && (
      <View style={styles.sectionWrapper}>
        <View style={styles.sectionHeader}>
          <Text style={styles.topSectionText}>Obras</Text>
        </View>
        <FlatList
          data={paginatedWorks}
          key={numColumns}
          keyExtractor={(item) => item.id.toString()}
          numColumns={numColumns}
          renderItem={renderWorkItem}
          contentContainerStyle={styles.worksContainer}
        />
        {workTotalPages > 1 && (
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              onPress={handlePrevWorkPage}
              disabled={workPage === 0}
              style={[
                styles.paginationButton,
                workPage === 0 && styles.paginationDisabled,
              ]}
            >
              <Ionicons name="chevron-back" size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleNextWorkPage}
              disabled={workPage === workTotalPages - 1}
              style={[
                styles.paginationButton,
                workPage === workTotalPages - 1 && styles.paginationDisabled,
              ]}
            >
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );

  const renderArtistsSection = () =>
    artists.length > 0 && (
      <View style={styles.bottomSection}>
        <View style={styles.bottomSectionHeader}>
          <Text style={styles.bottomSectionHeaderText}>ARTISTAS</Text>
        </View>
        <View style={styles.artistsContainer}>
          {paginatedArtists.map((artist) => (
            <TouchableOpacity
              key={artist.id}
              style={styles.artistCard}
              onPress={() =>
                router.push(`/profile/${artist.baseUser?.username}`)
              }
            >
              <Image
                source={artistImageSource(artist.baseUser?.imageProfile)}
                style={styles.artistImage}
              />
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.artistName}>
                  {artist.baseUser?.name ||
                    artist.username ||
                    "Nombre no disponible"}
                </Text>

                {artist.baseUser?.authority === "ARTIST_PREMIUM" && (
                  <View style={{ marginLeft: 4 }}>
                    <Icon
                      source="check-decagram"
                      size={24}
                      color={colors.brandSecondary}
                    />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
        {artistTotalPages > 1 && (
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              onPress={handlePrevArtistPage}
              disabled={artistPage === 0}
              style={[
                styles.paginationButton,
                artistPage === 0 && styles.paginationDisabled,
              ]}
            >
              <Ionicons name="chevron-back" size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleNextArtistPage}
              disabled={artistPage === artistTotalPages - 1}
              style={[
                styles.paginationButton,
                artistPage === artistTotalPages - 1 &&
                  styles.paginationDisabled,
              ]}
            >
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );

  const showNoResults = works.length === 0 && artists.length === 0;

  return (
    <ScrollView
      style={styles.container}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderTerminationRequest={() => false}
    >
      <View style={styles.topSection}>
        <Text style={styles.topSectionText}>
          {query.trim() ? `Resultados para “${query}”` : "Todos los resultados"}
        </Text>
      </View>

      {renderWorksSection()}
      {renderArtistsSection()}

      {showNoResults && (
        <Text style={styles.noResultsText}>Sin resultados</Text>
      )}
    </ScrollView>
  );
};

export default SearchScreen;
