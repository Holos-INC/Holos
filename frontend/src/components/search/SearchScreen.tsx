import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { BASE_URL } from "@/src/constants/api";
import { mobileStyles } from "@/src/styles/Search.styles";
import { Artist, SearchWorkDTO } from "@/src/constants/ExploreTypes"; // Añadir tipo Artist

const SearchScreen = ({ query }: { query: string }) => {
  const [workResults, setWorkResults] = useState<SearchWorkDTO[]>([]);
  const [artistResults, setArtistResults] = useState<Artist[]>([]);
  const [numColumns, setNumColumns] = useState<number>();
  const router = useRouter();
  const { width } = useWindowDimensions(); // Obtener el ancho de la pantalla

  useEffect(() => {
    const handleSearch = async () => {
      try {
        const worksResponse = await fetch(
          `${BASE_URL}/api/v1/search/works?query=${query || ""}` // Si query está vacío, busca todo
        );
        const worksData = await worksResponse.json();
        setWorkResults(worksData.content || []);

        const artistsResponse = await fetch(
          `${BASE_URL}/api/v1/search/artists?query=${query || ""}` // Si query está vacío, busca todo
        );
        const artistsData = await artistsResponse.json();
        setArtistResults(artistsData.content || []);
      } catch (error) {
        console.error("Error fetching works or artists:", error);
      }
    };

    handleSearch();
  }, [query]);

  useEffect(() => {
    const getNumColumns = () => {
      if (width > 1200) {
        return 3; // grandes, 3 columnas
      }
      if (width > 600) {
        return 2; // medianas, 2 columnas
      }
      return 1; // pequeñas, 1 columna
    };
    setNumColumns(getNumColumns());
  }, [width]);

  const isBase64Path = (base64: string): boolean => {
    try {
      const decoded = atob(base64);
      return decoded.startsWith("/images/");
    } catch (e) {
      return false;
    }
  };

  return (
    <ScrollView style={mobileStyles.container}>
      <View style={mobileStyles.topSection}>
        <Text style={mobileStyles.topSectionText}>
          {query.trim() === ""
            ? "Todos los resultados"
            : `Resultados para "${query}"`}
        </Text>
      </View>

      {/* Verificar si hay resultados */}
      {workResults.length === 0 && artistResults.length === 0 ? (
        <Text style={mobileStyles.noResultsText}>Sin resultados</Text>
      ) : (
        <>
          {/* Mostrar resultados de trabajos */}
          {workResults.length > 0 && (
            <View style={mobileStyles.sectionWrapper}>
              <Text style={mobileStyles.sectionTitle}>Trabajos</Text>
              <FlatList
                data={workResults}
                keyExtractor={(item, index) =>
                  item?.id ? item.id.toString() : `work-${index}`
                }
                key={`work-columns-${numColumns}`}
                numColumns={numColumns}
                contentContainerStyle={mobileStyles.worksScrollContainer}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={mobileStyles.cardWrapper}
                    onPress={() =>
                      router.push({
                        pathname: "/work/[workId]",
                        params: { workId: String(item.id) },
                      })
                    }
                  >
                    <View style={mobileStyles.cardContainer}>
                      <Image
                        source={{
                          uri:
                            item.image && isBase64Path(item.image)
                              ? `${BASE_URL}${atob(item.image)}`
                              : `data:image/jpeg;base64,${item.image}`, // Estaria bien usar predeterminada(No está aun)
                        }}
                        style={mobileStyles.image}
                        resizeMode="cover"
                        onError={() =>
                          console.log("Error cargando imagen:", item.image)
                        }
                      />
                      <View style={mobileStyles.textContainer}>
                        <Text style={mobileStyles.title}>{item.name}</Text>
                        <Text style={mobileStyles.artist}>
                          por @{item.artistUsername ?? "Desconocido"}
                        </Text>
                        <Text style={mobileStyles.description}>
                          {item.description}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {/* Mostrar resultados de artistas */}
          {artistResults.length > 0 && (
            <View style={mobileStyles.sectionWrapper}>
              <Text style={mobileStyles.sectionTitle}>Artistas</Text>
              <View style={mobileStyles.artistsContainer}>
                {artistResults.map((artist) => {
                  // Log de los datos del artista para verificar
                  return (
                    <View
                      key={artist.id}
                      style={mobileStyles.artistCardWrapper}
                    >
                      <TouchableOpacity
                        style={mobileStyles.artistCard}
                        onPress={() =>
                          router.push({
                            pathname: "/profile/[artistId]",
                            params: { artistId: String(artist.id) },
                          })
                        }
                      >
                        <Image
                          source={{
                            uri:
                              artist.baseUser?.imageProfile &&
                              isBase64Path(artist.baseUser?.imageProfile)
                                ? `${BASE_URL}${atob(
                                    artist.baseUser?.imageProfile
                                  )}`
                                : `data:image/jpeg;base64,${artist.baseUser?.imageProfile}`, // Estaria bien usar predeterminada(No está aun)
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
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};

export default SearchScreen;
