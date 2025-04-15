import React, { useState, useEffect, useMemo } from "react";
import { Text, ScrollView, View, TouchableWithoutFeedback,TextInput} from "react-native";
import { desktopStyles } from "@/src/styles/Explore.styles";
import { WorksDoneDTO } from "@/src/constants/ExploreTypes";
import { fetchWorksAndTransform, getTopThreeArtists } from "@/src/services/ExploreWorkHelpers";
import { desktopStyles as styles } from "@/src/styles/Explore.styles";
import WorkCard from "@/src/components/explore/WorkCard";
import { fetchWorksDone } from "@/src/services/WorksDoneApi";
import SearchScreen from "@/src/components/search/SearchScreen"; // Importa la pantalla de búsqueda
import { useAuth } from "@/src/hooks/useAuth";

export default function ExploreScreen() {
  const [works, setWorks] = useState<WorksDoneDTO[]>([]); // Obras destacadas
  const [searchQuery, setSearchQuery] = useState<string>(""); // Estado para la búsqueda
  const [isSearching, setIsSearching] = useState<boolean>(false); // Estado para alternar vistas
  const { loggedInUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const works = await fetchWorksAndTransform(loggedInUser.token); // Obtén las obras destacadas
        setWorks(works);
      } catch (error) {
        console.error("Error fetching works:", error);
      }
    };

    fetchData();
  }, [loggedInUser]);

  const firstThreeArtists = useMemo(() => getTopThreeArtists(), [works]);
  const handleSearch = () => {
    setIsSearching(true); // Cambia a la vista de búsqueda
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setIsSearching(false); // Cierra la búsqueda al tocar fuera
      }}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: "#fff" }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.container}>
          {/* Barra de búsqueda */}
          <TextInput
            style={[styles.searchBar, {marginTop: 25 }]}
            placeholder="Buscar trabajos o artistas..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch} // Realiza la búsqueda al presionar Enter
          />

          {isSearching ? (
            // Renderiza la pantalla de búsqueda
            <SearchScreen query={searchQuery} />
          ) : (
            // Pantalla principal de Explorer
            <>
              {/* Sección superior */}
              <View style={styles.topSection}>
                <Text style={styles.topSectionText}>Obras Destacadas</Text>
              </View>

              {/* Sección del medio: Obras */}
              <View style={styles.middleSection}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {works.map((work) => (
                    <WorkCard key={work.id} work={work} />
                  ))}
                </ScrollView>
              </View>

              {/* Sección inferior: Artistas */}
              <View style={styles.bottomSection}>
                <View style={styles.bottomSectionHeader}>
                  <Text style={styles.bottomSectionHeaderText}>ARTISTAS</Text>
                </View>
                <View style={styles.artistsContainer}>
                  {/* Aquí puedes agregar la lógica para mostrar artistas */}
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}