import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { getWorksDoneByArtist } from "@/src/services/WorksDoneApi";
import LoadingScreen from "@/src/components/LoadingScreen";
import styles from "@/src/styles/ArtistDetail.styles";
import { Button } from "react-native-paper";
import { useAuth } from "@/src/hooks/useAuth";
import { getUserByUsername } from "@/src/services/userApi";
import {
  BaseUserDTO,
  ArtistDTO,
  CommissionDTO,
} from "@/src/constants/CommissionTypes";
import ProfileHeader from "@/src/components/profile/ProfileHeader";
import ActionButtons from "@/src/components/profile/ActionButtons";
import ArtistProfileDialog from "@/src/components/profile/ProfileEditDialog";
import { getArtistByUsername } from "@/src/services/artistApi";
import { getImageSource } from "@/src/getImageSource";
import { WorksDoneDTO } from "@/src/constants/ExploreTypes";
import { MasonryGallery } from "@/src/components/profile/MasonryGallery";
import { getAllRequestedCommissionsDone } from "@/src/services/commisionApi";

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
  const [works, setWorks] = useState<WorksDoneDTO[] | CommissionDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  function isBaseUser(
    user: BaseUserDTO | ArtistDTO | null
  ): user is BaseUserDTO {
    return !!user && "authority" in user;
  }
  const isClient = isBaseUser(user) && user.authority === "CLIENT";
  const isPremium = isBaseUser(user) && user.authority === "ARTIST_PREMIUM";
  const isCurrentUser = loggedInUser?.username === user?.username;
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [fontsLoaded] = useFonts({
    "Montserrat-Regular": require("@/assets/fonts/Montserrat/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("@/assets/fonts/Montserrat/Montserrat-Bold.ttf"),
  });
  function isArtist(user: BaseUserDTO | ArtistDTO | null): user is ArtistDTO {
    return (
      !!user &&
      "authority" in user &&
      (user.authority === "ARTIST" || user.authority === "ARTIST_PREMIUM")
    );
  }

  const fetchData = async () => {
    try {
      const userData = await getUserByUsername(
        username,
        loggedInUser?.token || ""
      );
      if (isArtist(userData)) {
        await fetchArtistData(userData.username);
      } else {
        await fetchClientData(userData.username);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchArtistData = async (username: string) => {
    try {
      const artistData: ArtistDTO = await getArtistByUsername(username);
      setUser(artistData);
      const worksData: WorksDoneDTO[] = await getWorksDoneByArtist(username);
      setWorks(worksData);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchClientData = async (username: string) => {
    try {
      const clientData: BaseUserDTO = await getUserByUsername(
        username,
        loggedInUser.token
      );
      setUser(clientData);
      const worksData: CommissionDTO[] = await getAllRequestedCommissionsDone(
        username,
        loggedInUser.token
      );
      setWorks(worksData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [username]);

  useEffect(() => {
    if (!username) return;
    navigation.setOptions({ title: `${username}` });
  }, [navigation]);

  if (!fontsLoaded || loading) {
    return <LoadingScreen />;
  }

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
          user={user}
          isCurrentUser={isCurrentUser}
          isPremium={isPremium}
          onEditPress={() => setShowEditDialog(true)}
        />
        <ActionButtons
          isClient={isClient}
          isCurrentUser={isCurrentUser}
          username={user?.username}
        />
      </View>

      <View style={styles.divider} />
      <MasonryGallery works={works} />

      {user && (
        <ArtistProfileDialog
          visible={showEditDialog}
          onDismiss={() => setShowEditDialog(false)}
          user={user}
          setUser={setUser}
          token={loggedInUser?.token || ""}
          refreshUser={fetchData}
        />
      )}
    </ScrollView>
  );
}
