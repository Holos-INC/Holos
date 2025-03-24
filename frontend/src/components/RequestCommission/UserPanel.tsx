import { View, Text, Image } from "react-native";
import { Artist } from "@/src/constants/CommissionTypes";
import { BASE_URL } from "@/src/constants/api";

interface UserPanelProps {
  artist: Artist;
}

export default function UserPanel({ artist }: UserPanelProps) {
  if (!artist) {
    return <Text>Loading...</Text>;
  }

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
          source={{uri:BASE_URL+artist.baseUser.imageProfile}} // TODO Connect with static resources
          style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 10 }}
        />
      ) : (
        <Text>No profile image</Text>
      )}
      <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}>{artist.baseUser.name || "Unknown Artist"}</Text>
      <Text style={{ fontSize: 14, color: "#333" }}>@{artist.baseUser.username || "No Username"}</Text>
      <Text style={{ fontSize: 14, textAlign: "center", color: "#666", marginTop: 5 }}>
        {/* {artist.description || "No description available"} */}
      </Text>
    </View>
  );
}
