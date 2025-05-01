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
import colors from "@/src/constants/colors";

import { desktopStyles, mobileStyles } from "@/src/styles/Explore.styles";
import SearchScreen from "@/src/components/search/SearchScreen";
import { useAuth } from "@/src/hooks/useAuth";
import {
  fetchWorksAndTransform,
  getTopThreeArtists,
  ArtistMin,
} from "@/src/services/ExploreWorkHelpers";
import {
  SearchWorkDTO,
  WorksDoneDTO,
  BaseUser,
} from "@/src/constants/ExploreTypes";
import { getImageSource } from "@/src/utils/getImageSource";
import { BASE_URL } from "@/src/constants/api";
import { Icon } from "react-native-paper";
import OfficialCollaborators from "@/src/components/OfficialCollaborators";
import { MasonryGallery } from "@/src/components/profile/MasonryGallery";
import { ScrollView } from "react-native-gesture-handler";

export default function ExploreScreen() {
  const [works, setWorks] = useState<WorksDoneDTO[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [topThreeArtists, setTopThreeArtists] = useState<ArtistMin[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmedQuery, setConfirmedQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<(SearchWorkDTO | ArtistMin)[]>(
    []
  );
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [skipSuggestions, setSkipSuggestions] = useState(false);

  const { loggedInUser } = useAuth();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const styles = isDesktop ? desktopStyles : mobileStyles;
  const numColumns = isDesktop ? 3 : width > 500 ? 2 : 1;
  const margin = isDesktop ? 24 : 12;
  const cardWidth = (width - (numColumns + 1) * margin) / numColumns;
  const PAGE_SIZE = 9;
  const [page, setPage] = useState(0);

  const [fontsLoaded] = useFonts({
    "Merriweather-Regular": require("../../assets/fonts/Merriweather_24pt-Regular.ttf"),
    "Merriweather-Italic": require("../../assets/fonts/Merriweather_24pt-Italic.ttf"),
    "Merriweather-Bold": require("../../assets/fonts/Merriweather_24pt-Bold.ttf"),
    "Merriweather-BoldItalic": require("../../assets/fonts/Merriweather_24pt-BoldItalic.ttf"),
  });

  /* ----------- fetch suggestions ----------- */
  useEffect(() => {
    if (skipSuggestions) return;

    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const worksRes = await fetch(
          `${BASE_URL}/api/v1/search/works?query=${encodeURIComponent(
            searchQuery
          )}`
        ).then((r) => r.json());

        const artistRes = await fetch(
          `${BASE_URL}/api/v1/search/artists?query=${encodeURIComponent(
            searchQuery
          )}`
        ).then((r) => r.json());

        setSuggestions([
          ...(worksRes?.content ?? []),
          ...(artistRes?.content ?? []),
        ]);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Error fetching suggestions", err);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery, skipSuggestions]);

  /* ----------- initial data ----------- */
  useEffect(() => {
    (async () => {
      try {
        const { content, totalPages } = await fetchWorksAndTransform(
          loggedInUser?.token,
          page,
          PAGE_SIZE
        );
        setWorks(content);
        setTotalPages(totalPages);
      } catch (err) {
        console.error("Error fetching works:", err);
      }
    })();
  }, [page]);

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

  /* ----------- handlers ----------- */
  const handleNextPage = () => setPage((p) => Math.min(p + 1, totalPages - 1));
  const handlePrevPage = () => setPage((p) => Math.max(p - 1, 0));

  const confirmSearch = (value: string) => {
    setPage(0);
    setConfirmedQuery(value);
    setIsSearching(true);
    setShowSuggestions(false);
    setSkipSuggestions(false);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      confirmSearch(searchQuery.trim());
    } else {
      closeSearch();
    }
  };

  const closeSearch = () => {
    setIsSearching(false);
    setShowSuggestions(false);
    setSkipSuggestions(false);
    setConfirmedQuery("");
  };

  const handleScreenPress = () => {
    if (isSearching) return;
    if (showSuggestions) {
      setShowSuggestions(false);
      return;
    }
    closeSearch();
  };

  /* ----------- renderers ----------- */
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

  const renderListFooter = () => (
    <>
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
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.artistName}>{artist.name}</Text>

                  {artist.isPremium && (
                    <View style={{ marginLeft: 4 }}>
                      <Icon
                        source="check-decagram" // material-community
                        size={30}
                        color={colors.brandSecondary}
                      />
                    </View>
                  )}
                </View>

                {artist.location && (
                  <Text style={styles.artistLocation}>{artist.location}</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <OfficialCollaborators />
    </>
  );

  if (!fontsLoaded) return null;

  return (
    <TouchableWithoutFeedback
      onPress={handleScreenPress}
      disabled={isSearching}
    >
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={{ position: "relative", zIndex: 10 }}>
          <TextInput
            style={[styles.searchBar, { marginTop: 25 }]}
            placeholder="Buscar trabajos o artistas…"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              setSkipSuggestions(false);
            }}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />

          {showSuggestions && suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {suggestions.slice(0, 5).map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    const name =
                      "baseUser" in item
                        ? (item.baseUser as BaseUser)?.name ||
                          ("username" in item ? item.username : "")
                        : item.name;
                    setSearchQuery(name);
                    confirmSearch(name);
                    setSkipSuggestions(true);
                  }}
                  style={styles.suggestionItem}
                >
                  <Text style={styles.suggestionText}>
                    {"baseUser" in item
                      ? `🎨 ${
                          (item.baseUser as BaseUser)?.name ||
                          ("username" in item ? item.username : "")
                        }`
                      : `🖼️ ${item.name}`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {isSearching ? (
          <SearchScreen query={confirmedQuery} />
        ) : (
          <>
            <ScrollView
              contentContainerStyle={{
                paddingBottom: 32,
                paddingTop: 8,
              }}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.topSection}>
                <Text style={styles.topSectionText}>Obras</Text>
              </View>
              <MasonryGallery works={works} />
              {renderListFooter()}
            </ScrollView>
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
