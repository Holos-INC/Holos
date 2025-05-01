import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  useWindowDimensions,
  Modal,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Icon, IconButton } from "react-native-paper";
import colors from "@/src/constants/colors";
import { BaseUserDTO } from "@/src/constants/CommissionTypes";
import { ArtistDTO } from "@/src/constants/CommissionTypes";
import { getImageSource } from "@/src/utils/getImageSource";

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
  const [modalVisible, setModalVisible] = useState(false);
  const { width } = useWindowDimensions();
  const isCompact = width < 750;

  const tableCommisionsPrice =
    user && "tableCommisionsPrice" in user
      ? getImageSource(user.tableCommisionsPrice || "")
      : getImageSource("");

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
          flex: isCompact ? 1 : 2,
          gap: 20,
          alignItems: isCompact ? "center" : "flex-start",
          marginTop: isCompact ? 50 : 0,
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

      {user ? (
        "tableCommisionsPrice" in user ? (
          <>
            <Pressable
              style={{
                flex: 1,
                height: "100%",
                width: "100%",
                alignItems: "center",
              }}
              onPress={() => setModalVisible(true)}
            >
              <Image
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "contain",
                }}
                source={tableCommisionsPrice}
                onError={() =>
                  console.log("Error cargando imagen:", tableCommisionsPrice)
                }
              />
            </Pressable>

            <Modal
              visible={modalVisible}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setModalVisible(false)}
            >
              <Pressable
                style={{
                  flex: 1,
                  backgroundColor: "rgba(0,0,0,0.9)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => setModalVisible(false)}
              >
                <Image
                  source={tableCommisionsPrice}
                  style={{
                    width: "90%",
                    height: "70%",
                    resizeMode: "contain",
                  }}
                />
              </Pressable>
            </Modal>
          </>
        ) : (
          <View
            style={{
              flex: 1,
              width: "100%",
              alignItems: "center",
            }}
          />
        )
      ) : null}
    </View>
  );
};

export default ProfileHeader;
