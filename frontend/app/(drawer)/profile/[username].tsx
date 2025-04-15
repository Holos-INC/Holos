import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFonts } from "expo-font";

import { getArtistById, getArtistByUsername } from "@/src/services/artistApi";
import { getWorksDoneByArtist } from "@/src/services/WorksDoneApi";
import LoadingScreen from "@/src/components/LoadingScreen";

import { ArtistDTO } from "@/src/constants/ExploreTypes";
import { decodeImagePath } from "@/src/services/ExploreWorkHelpers";
import styles from "@/src/styles/ArtistDetail.styles";
import { Button, IconButton } from "react-native-paper";
import colors from "@/src/constants/colors";
import { BASE_URL } from "@/src/constants/api";
import { useAuth } from "@/src/hooks/useAuth";
import { getUserByUsername } from "@/src/services/userApi";
import { BaseUserDTO } from "@/src/constants/CommissionTypes";

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
  const [user, setUser] = useState<BaseUserDTO | null>(null);
  const isCurrentUser = loggedInUser?.username === user?.username || false;
  const isClient = user?.authorityName === "CLIENT" || true;
  const [works, setWorks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { width } = useWindowDimensions();
  const isCompact = width < 0.75 * 1000;

  const [fontsLoaded] = useFonts({
    "Montserrat-Regular": require("@/assets/fonts/Montserrat/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("@/assets/fonts/Montserrat/Montserrat-Bold.ttf"),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData: BaseUserDTO = await getUserByUsername(
          username,
          loggedInUser?.token || ""
        );
        setUser(userData);
        console.log(userData);

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

      <View
        style={{
          flex: 1,
          alignItems: "center",
          paddingVertical: 30,
        }}
      >
        <View
          style={{
            flexDirection: isCompact ? "column" : "row",
            alignItems: isCompact ? "center" : "flex-start",
            gap: isCompact ? 50 : 10,
            width: "100%",
          }}
        >
          <View
            style={{
              flex: 1,
              alignItems: "center",
              gap: 10,
              width: "100%",
            }}
          >
            <Image
              style={{
                width: 150,
                height: 150,
                borderRadius: 75,
                resizeMode: "cover",
              }}
              source={
                user?.imageProfile
                  ? { uri: `${BASE_URL}${atob(user.imageProfile)}` }
                  : undefined
              }
            />
            <Text style={{ fontSize: 16, fontFamily: "Montserrat-Bold" }}>
              @{user?.username || "undefined"}
            </Text>
          </View>

          <View
            style={{
              flex: isCompact ? 1 : 3,
              gap: 20,
              alignItems: isCompact ? "center" : "flex-start",
              marginTop: isCompact ? 20 : 0,
              width: "100%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: isCompact ? "center" : "flex-start",
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: "bold",
                  fontFamily: "Montserrat-Bold",
                  textAlign: isCompact ? "center" : "left",
                }}
              >
                {user?.name || "Nombre no disponible"}
              </Text>
              {isCurrentUser && (
                <IconButton
                  icon={"pencil"}
                  iconColor={colors.brandPrimary}
                  size={30}
                  onPress={() => router.push(`/profile/edit`)}
                />
              )}
            </View>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Montserrat-Regular",
                textAlign: isCompact ? "center" : "left",
              }}
            >
              {user?.description || "No hay descripción disponible."}
            </Text>
          </View>
        </View>
        {!isClient && isCurrentUser ? (
          <View
            style={{
              margin: 10,
              flexDirection: "row",
              alignSelf: "center",
              gap: 10,
            }}
          >
            <Button
              icon={"crown"}
              mode="contained"
              buttonColor={colors.brandPrimary}
              style={{ padding: 5 }}
              labelStyle={{ fontWeight: "bold", fontSize: 16 }}
              onPress={() => router.push(`/profile/premium`)}
            >
              Holos Premium
            </Button>
            <Button
              icon={"credit-card"}
              mode="contained"
              buttonColor={colors.brandPrimary}
              style={{ padding: 5 }}
              labelStyle={{ fontWeight: "bold", fontSize: 16 }}
              onPress={() => router.push(`/profile/stripe-setup`)}
            >
              Conectar Stripe
            </Button>
          </View>
        ) : !isClient && !isCurrentUser ? (
          <Button
            icon={"email"}
            mode="contained"
            buttonColor={colors.brandSecondary}
            style={{ padding: 5, alignSelf: "center" }}
            labelStyle={{ fontWeight: "bold", fontSize: 16 }}
            onPress={() =>
              router.push(`/commissions/request/${user?.username}`)
            }
          >
            Solicitar trabajo personalizado
          </Button>
        ) : null}
      </View>
      <View style={styles.divider} />

      {/* Sección inferior: scroll horizontal de obras */}
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
    </ScrollView>
  );
}
