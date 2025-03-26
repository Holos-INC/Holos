import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getArtistById } from "@/src/services/artistApi";
import { getWorksDoneByArtist } from "@/src/services/WorksDoneApi";
import styles from "@/src/styles/ArtistDetail.styles";
import { useLocalSearchParams, useRouter } from "expo-router";
import ReportDropdown from "@/src/components/report/ReportDropDown";
import { API_URL, BASE_URL } from "@/src/constants/api";
import { Artist } from "@/src/constants/CommissionTypes";
import LoadingScreen from "@/src/components/LoadingScreen";

interface Artwork {
  id: number;
  name: string;
  image: string;
}

export default function ArtistDetailScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { artistId } = useLocalSearchParams<{ artistId: string }>();

  const [artist, setArtist] = useState<Artist| null>(null);
  const [works, setWorks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [menuVisibleId, setMenuVisibleId] = useState<number| null>(null);
  

  useEffect(() => {
    const fetchData = async () => {
      const artistData: Artist = await getArtistById(Number(artistId));
      setArtist(artistData);
      const worksData: Artwork[] = await getWorksDoneByArtist(Number(artistId));
      setWorks(worksData);
      setLoading(false);
    };
    fetchData();
  }, [artistId]);

  useEffect(() => {
    navigation.setOptions({ title: `${artist?.baseUser.username}` });
  }, [navigation, artist]);

  if (loading) {
    return (
      <LoadingScreen />
    );
  }

  return (
      <TouchableWithoutFeedback onPress={() => {
        if (menuVisibleId !== null) {
         setMenuVisibleId(null);} // Cierra el menú al tocar fuera
        }}>
    <ScrollView contentContainerStyle={styles.container}>
      {/* Información del artista */}
      <View style={styles.header}>
        <Image
          source={{ uri: `${API_URL}${artist?.baseUser?.imageProfile}` }} // TODO Conseguir de imagenes estáticas
          style={styles.artistImage}
        />
        <View style={styles.artistDetails}>
          <Text style={styles.artistName}>{artist?.baseUser?.username}</Text>
          <Text style={styles.artistDescription}>@{artist?.baseUser?.username}</Text>
        </View>
      </View>

      {/* Botones de acción */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push(`/commissions/request/${artist?.baseUser.username}`)}
        >
          <Text style={styles.buttonText}>Solicitar trabajo</Text>
        </TouchableOpacity>
      </View>

      {/* Obras del artista */}
      <View style={styles.artworksContainer}>
        <Text style={styles.artworksTitle}>Obras del artista</Text>
        <View style={styles.artworksList}>
          {works.map((work: Artwork) => (
            <View key={work.id} style={styles.artworkItem}>

              <Image source={{ uri: `${BASE_URL}/${work.image}` }} style={styles.artworkImage} />
              <Text style={styles.artworkTitle}>{work.name}</Text>
              <View  style={ styles.reportDropDownContainer}>
              <ReportDropdown workId={work.id} menuVisibleId={menuVisibleId} setMenuVisibleId={setMenuVisibleId} isBigScreen={false} />
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
    </TouchableWithoutFeedback>
  );
}
