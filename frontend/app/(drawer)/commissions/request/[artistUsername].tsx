import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import RequestForm from "@/src/components/RequestCommission/RequestForm";
import { getArtistById, getArtistByUsername } from "@/src/services/artistApi";
import { Artist } from "@/src/constants/CommissionTypes";
import { router, useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import LoadingScreen from "@/src/components/LoadingScreen";
import { ArtistDTO } from "@/src/constants/CommissionTypes";
import { Button } from "react-native-paper";

export default function RequestCommissionUserScreen() {
  const router = useRouter();
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
      <ScrollView>
        <Button
          icon="arrow-left"
          onPress={() => router.push(`/profile/${artistUsername}`)}
          style={{
            position: "absolute",
            top: 24,
            left: 16,
            zIndex: 10,
            backgroundColor: "transparent",
          }}
          labelStyle={{ color: "grey" }}
        >
          ATRÁS
        </Button>

        {artist && <RequestForm artist={artist} />}
      </ScrollView>
    </ProtectedRoute>
  );

}
