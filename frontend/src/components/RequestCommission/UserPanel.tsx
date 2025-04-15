import { View, Text, Image } from "react-native";
import { BASE_URL } from "@/src/constants/api";
import LoadingScreen from "../LoadingScreen";
import { ArtistDTO } from "@/src/constants/ExploreTypes";

interface UserPanelProps {
  artist: ArtistDTO;
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
      {artist.imageProfile ? (
        <Image
          source={
            artist.imageProfile
              ? { uri: `${BASE_URL}${atob(artist.imageProfile)}` }
              : undefined
          }
          style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 10 }}
        />
      ) : (
        <Text>Sin imagen disponible</Text>
      )}
      <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}>
        {artist.name || "Artista desconocido"}
      </Text>
      <Text style={{ fontSize: 14, color: "#333" }}>
        @{artist.username || "Sin nombre de usuario"}
      </Text>
      <Text
        style={{
          fontSize: 14,
          textAlign: "center",
          color: "#666",
          marginTop: 5,
        }}
      >
        {/* Aquí puedes agregar más información específica para artistas premium si es necesario */}
      </Text>
    </View>
  );
}
