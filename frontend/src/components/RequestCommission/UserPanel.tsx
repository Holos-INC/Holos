import { View, Text, Image } from "react-native";
import { Artist } from "@/src/constants/CommissionTypes";
import { BASE_URL } from "@/src/constants/api";
import LoadingScreen from "../LoadingScreen";

interface UserPanelProps {
  artist: Artist;
}

export default function UserPanel({ artist }: UserPanelProps) {
  if (!artist) return <LoadingScreen />;

  return (
    <View
      style={{
        backgroundColor: "white",
        padding: 15,
        borderRadius: 15,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        margin: 10,
        width: 250,
      }}
    >
      {artist.baseUser.imageProfile ? (
        <Image
          source={
            artist.baseUser.imageProfile
              ? { uri: `${BASE_URL}${atob(artist.baseUser.imageProfile)}` }
              : undefined
          }
          style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 10 }}
        />
      ) : (
        <Text>Sin imagen disponible</Text>
      )}
      <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}>
        {artist.baseUser.name || "Artista desconocido"}
      </Text>
      <Text style={{ fontSize: 14, color: "#333" }}>
        @{artist.baseUser.username || "Sin nombre de usuario"}
      </Text>
      <Text style={{ fontSize: 14, color: "#666", marginTop: 5 }}>
        {artist.baseUser.authority.authority === "ARTIST_PREMIUM"
          ? "Artista Premium"
          : "Artista"}
      </Text>
      <Text style={{ fontSize: 14, textAlign: "center", color: "#666", marginTop: 5 }}>
        {/* Aquí puedes agregar más información específica para artistas premium si es necesario */}
      </Text>
    </View>
  );
}