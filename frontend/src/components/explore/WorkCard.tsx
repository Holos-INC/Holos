import React from "react";
import { TouchableOpacity, Image, View, Text } from "react-native";
import { useRouter } from "expo-router";
import { BASE_URL } from "@/src/constants/api";
import { WorksDoneDTO } from "@/src/constants/ExploreTypes";
import { desktopStyles } from "@/src/styles/Explore.styles";
import { DropdownMenu } from "../DropdownMenu";
import { useAuth } from "@/src/hooks/useAuth";
import { deleteWorksDone } from "@/src/services/WorksDoneApi";


type Props = {
  work: WorksDoneDTO;
};

const WorkCard = ({ work }: Props) => {
  const { isAuthenticated, isArtist, isAdmin, loggedInUser, loading } = useAuth();
  const router = useRouter();
  // const { width } = useWindowDimensions();
  // const isDesktop = width > 768;
  // const styles = isDesktop ? desktopStyles : mobileStyles;

  const isBase64Path = (base64: string): boolean => {
    try {
      const decoded = atob(base64);
      return decoded.startsWith("/images/");
    } catch (e) {
      return false;
    }
  };


  return (
    <View style={desktopStyles.cardWrapper}>
      <TouchableOpacity
        style={desktopStyles.cardContainer}
        onPress={() => router.push({ pathname: "/work/[workId]", params: { workId: String(work.id) } })}
      >
        <Image
          source={{
            uri: isBase64Path(work.image)
              ? `${BASE_URL}${atob(work.image)}`
              : `data:image/jpeg;base64,${work.image}`,
          }}
          style={desktopStyles.image}
          resizeMode="cover"
          onError={() => console.log("Error cargando imagen:", work.image)}
        />

        <View style={desktopStyles.textContainer}>
          <Text style={desktopStyles.title}>{work.name}</Text>
          {/* <Text style={desktopStyles.artist}>by @{work.artist?.baseUser?.username ?? "Artista desconocido"} </Text> */}
          <Text style={desktopStyles.description}>{work.description}</Text>
        </View>
      </TouchableOpacity>

      <View style={desktopStyles.dropdownOverlay}>
        {
          (!isArtist || work.baseUserId != loggedInUser.id) && 
          <DropdownMenu
            actions={[
          {
            label: 'Reportar',
            onPress: () => router.push({ pathname: "/report/[reportId]", params: { reportId: String(work.id) } }),
          }]}
          />
        }
        {
          ((isAdmin || isArtist)) && 
          <DropdownMenu
            actions={[
              {
                label: 'Eliminar',
                onPress: async () => {
              try {
                await deleteWorksDone(work.id);
                console.log("Obra eliminada exitosamente");
              } catch (error) {
                console.error("Error al eliminar la obra:", error);
              }
                },
              }]}
          />
        }
      </View>
    </View>
  );
};

export default WorkCard;
