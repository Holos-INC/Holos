import React from "react";
import { View, Text, Image, useWindowDimensions } from "react-native";
import { Icon, IconButton } from "react-native-paper";
import colors from "@/src/constants/colors";
import { BaseUserDTO } from "@/src/constants/CommissionTypes";
import { ArtistDTO } from "@/src/constants/CommissionTypes";
import { getImageSource } from "@/src/getImageSource";

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
        <Image
          style={{
            width: 150,
            height: 150,
            borderRadius: 75,
            resizeMode: "cover",
          }}
          source={getImageSource(user?.imageProfile || "")}
          onError={() =>
            console.log("Error cargando imagen:", user?.imageProfile)
          }
        />
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Montserrat-Bold",
          }}
        >
          @{user?.username}
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
              marginRight: 7,
            }}
          >
            {user?.name || "Nombre no disponible"}
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
              icon={"pencil"}
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
          {user?.description || "No hay descripción disponible."}
        </Text>
      </View>
    </View>
  );
};

export default ProfileHeader;
