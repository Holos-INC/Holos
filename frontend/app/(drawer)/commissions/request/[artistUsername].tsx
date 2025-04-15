import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, ScrollView } from "react-native";
import { styles } from "@/src/styles/RequestCommissionUserScreen.styles";
import UserPanel from "@/src/components/RequestCommission/UserPanel";
import RequestForm from "@/src/components/RequestCommission/RequestForm";
import { getArtistById, getArtistByUsername } from "@/src/services/artistApi";
import { Artist } from "@/src/constants/CommissionTypes";
import { useLocalSearchParams, useNavigation } from "expo-router";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import LoadingScreen from "@/src/components/LoadingScreen";
import { ArtistDTO } from "@/src/constants/ExploreTypes";

const commissionTablePrice = "@/assets/images/image.png";

export default function RequestCommissionUserScreen() {
  const { artistUsername } = useLocalSearchParams();
  const [artist, setArtist] = useState<ArtistDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const toStringParam = (param: string | string[]) =>
    typeof param === "string" ? param : param[0];

  useEffect(() => {
    if (!artistUsername) {
      console.error("El ID del artista no está definido!");
      return;
    }

    const fetchData = async () => {
      try {
        const artistData: ArtistDTO = await getArtistByUsername(
          toStringParam(artistUsername)
        );
        console.log("Artista encontrado:", artistData);
        setArtist(artistData);
      } catch (error) {
        console.error("Error al buscar artista:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [artistUsername]);

  useEffect(() => {
    navigation.setOptions({ title: `¡Haz un pedido a ${artist?.username}!` });
  }, [navigation, artist]);

  if (loading) return <LoadingScreen />;

  return (
    <ProtectedRoute allowedRoles={["CLIENT"]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {artist && <UserPanel artist={artist} />}

        <View style={styles.commissionContainer}>
          <Text style={styles.commissionTitle}>Precio de la comisión</Text>
          <Image source={require(commissionTablePrice)} resizeMode="contain" />
        </View>

        {artist && <RequestForm artist={artist} />}
      </ScrollView>
    </ProtectedRoute>
  );
}
