import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import { BASE_URL } from "@/src/constants/api";
import { mobileStyles } from "@/src/styles/Search.styles";
import { Artist, SearchWorkDTO } from "@/src/constants/ExploreTypes";

type Props = { query: string };

const SearchScreen = ({ query }: Props) => {
  /* ---------- state ---------- */
  const [workResults, setWorkResults] = useState<SearchWorkDTO[]>([]);
  const [artistResults, setArtistResults] = useState<Artist[]>([]);
  const router = useRouter();

  /* ---------- fetch ---------- */
  useEffect(() => {
    (async () => {
      try {
        /* obras */
        const w = await fetch(
          `${BASE_URL}/api/v1/search/works?query=${query || ""}`
        ).then((r) => r.json());
        setWorkResults(w.content || []);

        /* artistas */
        const a = await fetch(
          `${BASE_URL}/api/v1/search/artists?query=${query || ""}`
        ).then((r) => r.json());
        setArtistResults(a.content || []);
      } catch (err) {
        console.error("Error fetching search:", err);
      }
    })();
  }, [query]);

  /* ---------- helpers ---------- */
  const isBase64Path = (b64: string) => {
    try {
      return atob(b64).startsWith("/images/");
    } catch {
      return false;
    }
  };

  /* ---------- render ---------- */
  return (
    <ScrollView style={mobileStyles.container}>
      {/* título */}
      <View style={mobileStyles.topSection}>
        <Text style={mobileStyles.topSectionText}>
          {query.trim() ? `Resultados para “${query}”` : "Todos los resultados"}
        </Text>
      </View>

      {/* sin resultados */}
      {workResults.length === 0 && artistResults.length === 0 ? (
        <Text style={mobileStyles.noResultsText}>Sin resultados</Text>
      ) : (
        <>
          {/* ---------- OBRAS ---------- */}
          {workResults.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={mobileStyles.worksScrollContainer}
            >
              {workResults.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={mobileStyles.workItem}
                  onPress={() =>
                    router.push({
                      pathname: "/work/[workId]",
                      params: { workId: String(item.id) },
                    })
                  }
                >
                  <Image
                    source={{
                      uri:
                        item.image && isBase64Path(item.image)
                          ? `${BASE_URL}${atob(item.image)}`
                          : `data:image/jpeg;base64,${item.image}`,
                    }}
                    style={mobileStyles.workImage}
                  />
                  <View style={mobileStyles.workTextContainer}>
                    <Text style={mobileStyles.workTitle}>{item.name}</Text>
                    <Text style={mobileStyles.workArtist}>
                      por @{item.artistUsername ?? "Desconocido"}
                    </Text>
                    <Text style={mobileStyles.workSubtitle}>
                      {item.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* ---------- ARTISTAS ---------- */}
          {artistResults.length > 0 && (
            <View style={mobileStyles.artistsContainer}>
              {artistResults.map((artist) => (
                <TouchableOpacity
                  key={artist.id}
                  style={mobileStyles.artistCard}
                  onPress={() =>
                    router.push(`/profile/${artist.baseUser?.username}`)
                  }
                >
                  <Image
                    source={{
                      uri:
                        artist.baseUser?.imageProfile &&
                        isBase64Path(artist.baseUser.imageProfile)
                          ? `${BASE_URL}${atob(artist.baseUser.imageProfile)}`
                          : `data:image/jpeg;base64,${artist.baseUser?.imageProfile}`,
                    }}
                    style={mobileStyles.artistImage}
                  />
                  <View style={mobileStyles.artistTextContainer}>
                    <Text style={mobileStyles.artistName}>
                      {artist.baseUser?.username ||
                        artist.username ||
                        "Nombre no disponible"}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};

export default SearchScreen;
