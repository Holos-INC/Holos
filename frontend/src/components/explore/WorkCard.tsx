import React from "react";
import { TouchableOpacity, Image, View, Text } from "react-native";
import { useRouter } from "expo-router";
import { BASE_URL } from "@/src/constants/api";
import { WorksDoneDTO } from "@/src/constants/ExploreTypes";
import { styles } from "@/src/styles/Explore.styles";
import { DropdownMenu } from "../DropdownMenu";


type Props = {
  work: WorksDoneDTO;
};

const WorkCard = ({ work }: Props) => {
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
    <View style={styles.cardWrapper}>
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() => router.push({ pathname: "/work/[workId]", params: { workId: String(work.id) } })}
      >
        <Image
          source={{
            uri: isBase64Path(work.image)
              ? `${BASE_URL}${atob(work.image)}`
              : `data:image/jpeg;base64,${work.image}`,
          }}
          style={styles.image}
          resizeMode="cover"
          onError={() => console.log("Error cargando imagen:", work.image)}
        />

        <View style={styles.textContainer}>
          <Text style={styles.title}>{work.name}</Text>
          {/* <Text style={styles.artist}>by @{work.artist?.baseUser?.username ?? "Artista desconocido"} </Text> */}
          <Text style={styles.description}>{work.description}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.dropdownOverlay}>
      <DropdownMenu
        actions={[{
          label: 'Reportar',
          onPress: () => router.push(`/report/${work.id}`)
        }]}
      />
      </View>
    </View>
  );
};

export default WorkCard;
