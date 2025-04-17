import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { getWorksDoneByArtist } from "@/src/services/WorksDoneApi";
import LoadingScreen from "@/src/components/LoadingScreen";
import { decodeImagePath } from "@/src/services/ExploreWorkHelpers";
import styles from "@/src/styles/ArtistDetail.styles";
import { Button } from "react-native-paper";
import { useAuth } from "@/src/hooks/useAuth";
import { getUserByUsername } from "@/src/services/userApi";
import { BaseUserDTO } from "@/src/constants/CommissionTypes";
import ProfileHeader from "@/src/components/profile/ProfileHeader";
import ActionButtons from "@/src/components/profile/ActionButtons";
import ArtistProfileDialog from "@/src/components/profile/ProfileEditDialog";
import { ArtistDTO } from "@/src/constants/ExploreTypes";

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
  function isBaseUser(
    user: BaseUserDTO | ArtistDTO | null
  ): user is BaseUserDTO {
    return !!user && "authorityName" in user;
  }
  const isClient = isBaseUser(user) && user.authorityName === "CLIENT";
  const isPremium = isBaseUser(user) && user.authorityName === "ARTIST_PREMIUM";
  const isCurrentUser = loggedInUser?.username === user?.username;
  const [showEditDialog, setShowEditDialog] = useState(false);

  const [fontsLoaded] = useFonts({
    "Montserrat-Regular": require("@/assets/fonts/Montserrat/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("@/assets/fonts/Montserrat/Montserrat-Bold.ttf"),
  });

  const fetchData = async () => {
    try {
      const userData: BaseUserDTO = await getUserByUsername(
        username,
        loggedInUser?.token || ""
      );
      setUser(userData);

      const worksData: Artwork[] = await getWorksDoneByArtist(
        userData.username || ""
      );
      setWorks(worksData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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
