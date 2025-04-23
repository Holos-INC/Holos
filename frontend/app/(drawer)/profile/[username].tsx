// frontend/app/(drawer)/profile/[username].tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { getWorksDoneByArtist } from "@/src/services/WorksDoneApi";
import LoadingScreen from "@/src/components/LoadingScreen";
import { decodeImagePath } from "@/src/services/ExploreWorkHelpers";
import styles from "@/src/styles/ArtistDetail.styles";
import { Button } from "react-native-paper";
import { useAuth } from "@/src/hooks/useAuth";
import { getArtistByUsername } from "@/src/services/artistApi";
import { ArtistDTO } from "@/src/constants/ExploreTypes";
import ProfileHeader from "@/src/components/profile/ProfileHeader";
import ActionButtons from "@/src/components/profile/ActionButtons";
import ArtistProfileDialog from "@/src/components/profile/ProfileEditDialog";

interface Artwork {
  id: number;
  name: string;
  image: string;
  artistName?: string;
  description?: string;
}

export default function ArtistDetailScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { loggedInUser } = useAuth();
  const { username } = useLocalSearchParams<{ username: string }>();

  // Estado local renombrado para no chocar con el callback
  const [artist, setArtistState] = useState<ArtistDTO | null>(null);
  const [works, setWorks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const [fontsLoaded] = useFonts({
    "Montserrat-Regular": require("@/assets/fonts/Montserrat/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("@/assets/fonts/Montserrat/Montserrat-Bold.ttf"),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const artistData = await getArtistByUsername(username || "");
        setArtistState(artistData);
        const worksData = await getWorksDoneByArtist(artistData.username);
        setWorks(worksData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [username]);

  useEffect(() => {
    if (username) {
      navigation.setOptions({ title: username });
    }
  }, [navigation, username]);

  if (!fontsLoaded || loading) {
    return <LoadingScreen />;
  }

  const isCurrentUser = loggedInUser?.username === artist?.username;
  const isPremium = loggedInUser?.roles.includes("ARTIST_PREMIUM") ?? false;

  const extractInstaUser = (url: string) => {
    const m = url.match(/instagram\.com\/([^\/?]+)/);
    return m ? m[1] : url;
  };

  return (
    <ScrollView style={styles.container}>
      <Button
        onPress={() => router.push("/")}
        icon={"arrow-left"}
        style={{ alignItems: "flex-start" }}
        labelStyle={{ color: "grey" }}
      >
        ATRÁS
      </Button>

      <View style={{ flex: 1, alignItems: "center", paddingVertical: 30 }}>
        <ProfileHeader
          user={artist}
          isCurrentUser={isCurrentUser}
          isPremium={isPremium}
          onEditPress={() => setShowEditDialog(true)}
        />

        {artist?.linkToSocialMedia && (
          <TouchableOpacity
            onPress={() => Linking.openURL(artist.linkToSocialMedia)}
          >
            <Text
              style={{
                color: "#3897f0",
                fontSize: 16,
                marginVertical: 8,
              }}
            >
              @{extractInstaUser(artist.linkToSocialMedia)}
            </Text>
          </TouchableOpacity>
        )}

        <ActionButtons
          isClient={false}
          isCurrentUser={isCurrentUser}
          username={artist?.username}
        />
      </View>

      <View style={styles.divider} />

      <View style={styles.bottomContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.worksScrollContainer}
        >
          {works.map((work) => (
            <TouchableOpacity
              key={work.id}
              style={styles.workItem}
              onPress={() =>
                router.push({
                  pathname: "/work/[workId]",
                  params: { workId: String(work.id) },
                })
              }
            >
              <Image
                source={{ uri: decodeImagePath(work.image) }}
                style={styles.workImage}
              />
              <View style={styles.workTextContainer}>
                <Text style={styles.workTitle}>{work.name}</Text>
                <Text style={styles.workArtist}>{work.artistName}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {artist && (
        <ArtistProfileDialog
          visible={showEditDialog}
          onDismiss={() => setShowEditDialog(false)}
          user={artist}
          // Aquí adaptamos la firma: recibe BaseUserDTO|ArtistDTO, nosotros lanzamos ArtistDTO
          setUser={(u) => setArtistState(u as ArtistDTO)}
          token={loggedInUser?.token || ""}
          refreshUser={() => {
            setLoading(true);
            return getArtistByUsername(username || "")
              .then((ud) => {
                setArtistState(ud);
                return getWorksDoneByArtist(ud.username);
              })
              .then((w) => setWorks(w))
              .finally(() => setLoading(false));
          }}
        />
      )}
    </ScrollView>
  );
}
