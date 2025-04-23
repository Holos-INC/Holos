import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  useWindowDimensions,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import LoadingScreen from "@/src/components/LoadingScreen";
import ProfileHeader from "@/src/components/profile/ProfileHeader";
import ActionButtons from "@/src/components/profile/ActionButtons";
import ArtistProfileDialog from "@/src/components/profile/ProfileEditDialog";

import { getUserByUsername } from "@/src/services/userApi";
import { getArtistByUsername } from "@/src/services/artistApi";
import { getWorksDoneByArtist } from "@/src/services/WorksDoneApi";
import { decodeImagePath } from "@/src/services/ExploreWorkHelpers";

import { BaseUserDTO } from "@/src/constants/CommissionTypes";
import { ArtistDTO } from "@/src/constants/ExploreTypes";

import { Button } from "react-native-paper";
import styles from "@/src/styles/ArtistDetail.styles";
import { useAuth } from "@/src/hooks/useAuth";

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

  const [user, setUser] = useState<BaseUserDTO | ArtistDTO | null>(null);
  const [works, setWorks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const { width } = useWindowDimensions();
  const isCompact = Platform.OS === "web" ? width < 775 : false;

  const [fontsLoaded] = useFonts({
    "Montserrat-Regular": require("@/assets/fonts/Montserrat/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("@/assets/fonts/Montserrat/Montserrat-Bold.ttf"),
  });
  const extractInstaUser = (url: string) => {
    const m = url.match(/instagram\.com\/([^\/?]+)/);
    return m ? m[1] : url;
  };

  useEffect(() => {
    if (username) {
      navigation.setOptions({ title: username });
      fetchData();
    }
  }, [username]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const baseUser: BaseUserDTO = await getUserByUsername(
        username!,
        loggedInUser?.token || ""
      );
      if (
        baseUser.authorityName === "ARTIST" ||
        baseUser.authorityName === "ARTIST_PREMIUM"
      ) {
        const artistData: ArtistDTO = await getArtistByUsername(
          username!,
        );
        setUser(artistData);
        const worksData = await getWorksDoneByArtist(artistData.username);
        setWorks(worksData);
      } else {
        setUser(baseUser);
        setWorks([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded || loading || !user) {
    return <LoadingScreen />;
  }

  const isCurrentUser = loggedInUser?.username === user.username;
  const isPremium =
    "authorityName" in user && user.authorityName === "ARTIST_PREMIUM";


  const isArtist = (u: BaseUserDTO | ArtistDTO): u is ArtistDTO =>
    "tableCommisionsPrice" in u;

  return (
    <ScrollView style={styles.container}>
      {/* Botón ATRÁS */}
      <Button
        onPress={() => router.push("/")}
        icon="arrow-left"
        style={{ alignItems: "flex-start" }}
        labelStyle={{ color: "grey" }}
      >
        ATRÁS
      </Button>

      {/* Header: foto, nombre, descripción y botón editar */}
      <View style={{ flex: 1, alignItems: "center", paddingVertical: 30 }}>
        <ProfileHeader
          user={user}
          isCurrentUser={isCurrentUser}
          isPremium={isPremium}
          onEditPress={() => setShowEditDialog(true)}
        />

        {/* Enlace a redes sociales */}
        {"linkToSocialMedia" in user && user.linkToSocialMedia && (
          <TouchableOpacity
            onPress={() => Linking.openURL(user.linkToSocialMedia)}
            style={{
              width: "100%",
              alignItems: isCompact ? "center" : "flex-start",
              marginVertical: 8,
            }}
          >
            <Text
              style={{
                color: "#000",
                fontWeight: "bold",
                fontSize: 16,
                textAlign: isCompact ? "center" : "left",
              }}
            >
              @{extractInstaUser(user.linkToSocialMedia)}
            </Text>
          </TouchableOpacity>
        )}


        {/* Botones secundarios (solicitar trabajo, stripe, etc.) */}
        <ActionButtons
          isClient={!("linkToSocialMedia" in user)}
          isCurrentUser={isCurrentUser}
          username={user.username}
        />
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Obras horizontales (sólo artista) */}
      {works.length > 0 && (
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
      )}

      {/* Diálogo de edición */}
      {user && (
        <ArtistProfileDialog
          visible={showEditDialog}
          onDismiss={() => setShowEditDialog(false)}
          user={user}
          setUser={(u) => setUser(u)}
          token={loggedInUser?.token || ""}
          refreshUser={fetchData}
        />
      )}
    </ScrollView>
  );
}
