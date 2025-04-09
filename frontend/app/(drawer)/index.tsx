
import React, { useState, useEffect, useMemo } from "react";
import { Text, ScrollView, View, TouchableWithoutFeedback   } from "react-native";
import { styles } from "@/src/styles/Explore.styles";
import { WorksDoneDTO } from "@/src/constants/ExploreTypes";
import { getFirstThreeArtists } from "@/src/services/ExploreWorkHelpers";
import WorkCard from "@/src/components/explore/WorkCard";
import { fetchWorksDone } from "@/src/services/WorksDoneApi";

export default function ExploreScreen() {
  const [works, setWorks] = useState<WorksDoneDTO[]>([]);
  const [menuVisibleId, setMenuVisibleId] = useState<number | null>(null);

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