import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import RequestForm from "@/src/components/RequestCommission/RequestForm";
import { getArtistById, getArtistByUsername } from "@/src/services/artistApi";
import { Artist } from "@/src/constants/CommissionTypes";
import { useLocalSearchParams, useNavigation } from "expo-router";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import LoadingScreen from "@/src/components/LoadingScreen";

export default function RequestCommissionUserScreen() {
  const { artistUsername } = useLocalSearchParams();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const toStringParam = (param: string | string[]) => typeof param === 'string' ? param : param[0];

  useEffect(() => {
    if (!artistUsername) {
      console.error("El ID del artista no está definido!");
      return;
    }

    const fetchData = async () => {
      try {
        const artistData: Artist = await getArtistByUsername(toStringParam(artistUsername));
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
    navigation.setOptions({ title: `¡Haz un pedido a ${artist?.baseUser.username}!` });
    }, [navigation, artist]);

  if (loading) return <LoadingScreen/>

  return (
    <ProtectedRoute allowedRoles={["CLIENT"]}>
      <ScrollView>
      {artist && <RequestForm artist={artist} />}
      </ScrollView>
    </ProtectedRoute>
  );
}
