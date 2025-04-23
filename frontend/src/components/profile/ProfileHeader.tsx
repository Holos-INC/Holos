import React from "react";
import { View, Text, Image, useWindowDimensions } from "react-native";
import { Icon, IconButton } from "react-native-paper";
import colors from "@/src/constants/colors";
import { BaseUserDTO } from "@/src/constants/CommissionTypes";
import { ArtistDTO } from "@/src/constants/ExploreTypes";

type ProfileHeaderProps = {
  user: BaseUserDTO | ArtistDTO | null;
  isCurrentUser: boolean;
  isPremium: boolean;
  onEditPress: () => void;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  isCurrentUser,
  isPremium,
  onEditPress,
}) => {
  const { width } = useWindowDimensions();
  const isCompact = width < 750;
  const isArtist = (u: BaseUserDTO | ArtistDTO | null): u is ArtistDTO =>
    !!u && "tableCommisionsPrice" in u;
  const makeUri = (b64OrUri: string, defaultMime: string) => {
    if (b64OrUri.startsWith("data:")) {
      return b64OrUri;
    }
    return `data:${defaultMime};base64,${b64OrUri}`;
  };

  return (
    <View
      style={{
        flexDirection: isCompact ? "column" : "row",
        alignItems: isCompact ? "center" : "flex-start",
        gap: isCompact ? 50 : 10,
        width: "100%",
      }}
    >
      <View style={{ flex: 1, alignItems: "center", gap: 10 }}>
        {/* Foto de perfil */}
        <Image
          style={{
            width: 150,
            height: 150,
            borderRadius: 75,
            resizeMode: "cover",
            borderWidth: 1,
            borderColor: "red",
          }}
          source={
            user?.imageProfile
              ? { uri: makeUri(user.imageProfile, "image/png") }
              : undefined
          }
        />

        {/* Tabla de comisiones (solo artistas) */}
        {isArtist(user) && user.tableCommisionsPrice && (
          <>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "bold",
                marginTop: 8,
                textAlign: "center",
              }}
            >
              📋 Tabla de precios
            </Text>
            <Image
              style={{
                width: 150,
                height: 150,
                borderRadius: 8,
                resizeMode: "contain",
                marginTop: 4,
                borderWidth: 1,
                borderColor: "blue", 
                backgroundColor: "#eee",
              }}
              source={{
                uri: makeUri(user.tableCommisionsPrice, "image/png"),
              }}
            />
          </>
        )}
      </View>

      {/* Nombre, iconos y descripción */}
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
              marginRight: 7,
            }}
          >
            {user?.name ?? "Nombre no disponible"}
          </Text>
          {isPremium && (
            <Icon
              source="check-decagram"
              size={30}
              color={colors.brandSecondary}
            />
          )}
          {isCurrentUser && (
            <IconButton
              icon="pencil"
              iconColor={colors.brandPrimary}
              size={30}
              onPress={onEditPress}
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
          {user?.description ?? "No hay descripción disponible."}
        </Text>
      </View>
    </View>
  );
};

export default ProfileHeader;
