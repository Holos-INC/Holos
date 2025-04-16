import { View, Text, Image } from "react-native";
import { Artist } from "@/src/constants/CommissionTypes";
import { BASE_URL } from "@/src/constants/api";
import LoadingScreen from "../LoadingScreen";
import { styles } from "@/src/styles/UserPanel.styles";

interface UserPanelProps {
  artist: Artist;
}

export default function UserPanel({ artist }: UserPanelProps) {
  if (!artist) return <LoadingScreen />;

  return (
    <View style={styles.container}>
      {artist.baseUser.imageProfile ? (
        <Image
          source={{ uri: `${BASE_URL}${atob(artist.baseUser.imageProfile)}` }}
          style={styles.profileImage}
        />
      ) : (
        <Text>Sin imagen disponible</Text>
      )}

      <Text style={styles.name}>
        {artist.baseUser.name || "Artista desconocido"} : @{artist.baseUser.username || "Sin nombre de usuario"}
      </Text>
      <Text style={styles.role}>
        {artist.baseUser.authority.authority === "ARTIST_PREMIUM"
          ? "Artista Premium"
          : "Artista"}
      </Text>
    </View>
  );
}
