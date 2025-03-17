import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { RootDrawerParamList } from "@/app/_layout";
import { getArtistById } from "@/src/services/ArtistService";
import { getWorksDoneByArtist } from "@/src/services/WorksDoneService";
import styles from "@/src/styles/ArtistDetail.styles";
import { useLocalSearchParams, useRouter } from "expo-router";

interface Artwork {
  id: number;
  name: string;
  image: string;
}

interface Artist {
  id: number;
  username: string;
  image: string;
  description: string;
  artworks: Artwork[];
}

interface ArtistDetailScreenProps {
  route: {
    params: {
      artistId: number;
    };
  };
}

export default function ArtistDetailScreen() {
  const BASE_URL = "http://localhost:8080";
  const router = useRouter();
  const navigation = useNavigation();
  const { artistId } = useLocalSearchParams<{ artistId: string }>();

  const [artist, setArtist] = useState<Artist | null>(null);
  const [works, setWorks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      console.log(artistId);
      const artistData: Artist = await getArtistById(artistId);
      setArtist(artistData);
      const worksData: Artwork[] = await getWorksDoneByArtist(artistId);
      setWorks(worksData);
      setLoading(false);
    };
    fetchData();
  }, [artistId]);

  useEffect(() => {
    navigation.setOptions({ title: `${artist?.username}` });
  }, [navigation, artist]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Información del artista */}
      <View style={styles.header}>
        <Image
          source={{ uri: `${BASE_URL}${artist?.image}` }}
          style={styles.artistImage}
        />
        <View style={styles.artistDetails}>
          <Text style={styles.artistName}>{artist?.username}</Text>
          <Text style={styles.artistDescription}>{artist?.description}</Text>
        </View>
      </View>

      {/* Botones de acción */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: "/commission/request/[artistId]",
              params: { artistId: String(artist?.id) },
            })            
            // navigation.navigate("RequestCommission", { artistId: artist!.id })
          }
        >
          <Text style={styles.buttonText}>Solicitar trabajo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Añadir a favoritos</Text>
        </TouchableOpacity>
      </View>

      {/* Obras del artista */}
      <View style={styles.artworksContainer}>
        <Text style={styles.artworksTitle}>Obras del artista</Text>
        <View style={styles.artworksList}>
          {works.map((work: Artwork) => (
            <View key={work.id} style={styles.artworkItem}>
              <Image source={{ uri: `${BASE_URL}${work.image}` }} style={styles.artworkImage} />
              <Text style={styles.artworkTitle}>{work.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
