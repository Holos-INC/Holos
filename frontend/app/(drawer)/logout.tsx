import { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import { useRouter } from "expo-router";

export default function LogoutScreen() {
  const { signOut } = useContext(AuthenticationContext);
  const router = useRouter();

  const handleLogout = () => {
    router.replace("/login");
    signOut(() => console.log("Logged out!"));
  };

  return (
    <View style={styles.screen}>
      <Button
        onPress={() => router.back()}
        icon="arrow-left"
        labelStyle={{ color: "grey" }}
        style={{ alignSelf: "flex-start", margin: 16 }}
      >
        ATRÁS
      </Button>

      <View style={styles.centerContent}>
        <Text style={styles.heading}>¿Vas a salir ya?</Text>
        <Text style={styles.subtext}>Te vamos a extrañar...</Text>

        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
          labelStyle={styles.logoutLabel}
        >
          Cerrar sesión 😿
        </Button>
      </View>
    </View>

  );

}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  heading: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
    color: "#444",
  },
  subtext: {
    fontSize: 14,
    color: "#777",
    marginBottom: 24,
  },
  logoutButton: {
    backgroundColor: "#F05A7E",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  logoutLabel: {
    fontSize: 16,
    color: "#fff",
  },
  topLeftContainer: {
    position: "absolute",
    top: 24,
    left: 24,
  },

  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});
