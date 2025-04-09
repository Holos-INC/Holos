import { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import { useRouter } from "expo-router";

export default function LogoutScreen() {
  const { signOut } = useContext(AuthenticationContext);
  const router = useRouter();

  const handleLogout = () => {
    signOut(() => console.log("Logged out!"));
    router.replace("/login");
  };

  return (
    <View style={styles.screen}>
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
});
