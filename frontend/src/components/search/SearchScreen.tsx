import React, { useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, ScrollView, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { BASE_URL } from "@/src/constants/api";
import { mobileStyles } from "@/src/styles/Search.styles";
import { Work, Artist } from "@/src/constants/ExploreTypes"; // Añadir tipo Artist

const SearchScreen = () => {
  const [query, setQuery] = useState("");
  const [workResults, setWorkResults] = useState<Work[]>([]);
  const [artistResults, setArtistResults] = useState<Artist[]>([]); // Nuevo estado para artistas
  const router = useRouter();
  const { width } = useWindowDimensions(); // Obtener el ancho de la pantalla

  const handleSearch = async () => {
    try {
      // Buscar trabajos
      const worksResponse = await fetch(`${BASE_URL}/api/v1/search/works?query=${query}`);
      const worksData = await worksResponse.json();
      setWorkResults(worksData.content || []);

      // Buscar artistas
      const artistsResponse = await fetch(`${BASE_URL}/api/v1/search/artists?query=${query}`);
      const artistsData = await artistsResponse.json();
      setArtistResults(artistsData.content || []);
    } catch (error) {
      console.error("Error fetching works or artists:", error);
    }
  };

  const getNumColumns = () => {
    if (width > 1200) {
      return 3; // grandes, 3 columnas
    }
    if (width > 600) {
      return 2; // medianas, 2 columnas
    }
    return 1; // pequeñas, 1 columna
  };

  return (
    <ScrollView style={mobileStyles.container}>
      {/* Input de búsqueda */}
      <View style={mobileStyles.topSection}>
        <Text style={mobileStyles.topSectionText}>Buscar Trabajos y Artistas</Text>
      </View>

      <TextInput
        style={mobileStyles.input}
        placeholder="Buscar por nombre..."
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
      />

      {/* Verificar si hay resultados */}
      {workResults.length === 0 && artistResults.length === 0 && query ? (
        <Text style={mobileStyles.noResultsText}>Sin resultados</Text>
      ) : (
        <>
          {/* Mostrar resultados de trabajos */}
          {workResults.length > 0 && (
            <View style={mobileStyles.sectionWrapper}>
              <Text style={mobileStyles.sectionTitle}>Trabajos</Text>
              <FlatList
                data={workResults}
                keyExtractor={(item) => item.id.toString()}
                numColumns={getNumColumns()}
                contentContainerStyle={mobileStyles.worksScrollContainer}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={mobileStyles.cardWrapper}
                    onPress={() => router.push({ pathname: "/work/[workId]", params: { workId: String(item.id) } })}
                  >
                    <View style={mobileStyles.cardContainer}>
                      <Image source={{ uri: `${BASE_URL}${item.image}` }} style={mobileStyles.image} />
                      <View style={mobileStyles.textContainer}>
                        <Text style={mobileStyles.title}>{item.name}</Text>
                        <Text style={mobileStyles.artist}>by @{item.artist?.baseUser?.username ?? "Desconocido"}</Text>
                        <Text style={mobileStyles.description}>{item.description}</Text>
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
                  console.log(artist);

                  return (
                    <View key={artist.id} style={mobileStyles.artistCardWrapper}>
                      <TouchableOpacity
                        style={mobileStyles.artistCard}
                        onPress={() =>
                          router.push({ pathname: "/profile/[artistId]", params: { artistId: String(artist.id) } })
                        }
                      >
                        <Image
                          source={{
                            uri: `${BASE_URL}${artist.baseUser?.imageProfile || '/default-image.png'}`  // Estaria bien usar predeterminada(No está aun)
                          }}
                          style={mobileStyles.artistImage}
                        />
                        <View style={mobileStyles.artistTextContainer}>
                          <Text style={mobileStyles.artistName}>
                            {artist.baseUser?.username || artist.username || 'Nombre no disponible'}
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
