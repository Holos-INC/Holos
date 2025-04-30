import { View, Text, Image } from "react-native";
import { BASE_URL } from "@/src/constants/api";
import LoadingScreen from "../LoadingScreen";
import { styles } from "@/src/styles/UserPanel.styles";
import { ArtistDTO } from "@/src/constants/CommissionTypes";
import { getImageSource } from "@/src/getImageSource";

interface UserPanelProps {
  artist: ArtistDTO;
}

export default function UserPanel({ artist }: UserPanelProps) {
  if (!artist) return <LoadingScreen />;

  return (
    <View style={styles.container}>
      {artist.imageProfile ? (
        <Image
          source={getImageSource(artist.imageProfile)}
          style={styles.profileImage}
        />
      ) : (
        <Text>Sin imagen disponible</Text>
      )}

      <Text style={styles.name}>
        {artist.name || "Artista desconocido"} : @
        {artist.username || "Sin nombre de usuario"}
      </Text>
    </View>
  );
}
