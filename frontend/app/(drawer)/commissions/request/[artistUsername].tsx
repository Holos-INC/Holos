import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, ScrollView } from "react-native";
import { styles } from "@/src/styles/RequestCommissionUserScreen.styles";
import UserPanel from "@/src/components/RequestCommission/UserPanel";
import RequestForm from "@/src/components/RequestCommission/RequestForm";
import { getArtistById, getArtistByUsername } from "@/src/services/artistApi";
import { Artist } from "@/src/constants/CommissionTypes";
import { useLocalSearchParams, useNavigation } from "expo-router";
import ProtectedRoute from "@/src/components/ProtectedRoute";

const commissionTablePrice = "@/assets/images/image.png";

export default function RequestCommissionUserScreen() {
  const { artistUsername } = useLocalSearchParams();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const toStringParam = (param: string | string[]) => typeof param === 'string' ? param : param[0];

  useEffect(() => {
    if (!artistUsername) {
      console.error("Artist ID is undefined!");
      return;
    }

    const fetchData = async () => {
      try {
        const artistData: Artist = await getArtistByUsername(toStringParam(artistUsername));
        setArtist(artistData);
      } catch (error) {
        console.error("Error fetching artist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [artistUsername]);

  useEffect(() => {
    navigation.setOptions({ title: `Commision ${artist?.baseUser.username}!` });
    }, [navigation, artist]);

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["CLIENT"]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {artist && <UserPanel artist={artist} />}

        <View style={styles.commissionContainer}>
          <Text style={styles.commissionTitle}>Commission Prices</Text>
          <Image source={require(commissionTablePrice)} resizeMode="contain" />
        </View>

        {artist && <RequestForm artist={artist} />}
      </ScrollView>
    </ProtectedRoute>
  );
}
