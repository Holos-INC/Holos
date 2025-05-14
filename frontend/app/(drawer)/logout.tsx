import React, { useContext } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Button } from "react-native-paper";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import { useRouter } from "expo-router";
import colors from "@/src/constants/colors";
import { useEffect } from "react";
import { useNavigation } from "expo-router";

export default function LogoutScreen() {
  const { signOut } = useContext(AuthenticationContext);
  const router = useRouter();
  const navigation = useNavigation();
  
    useEffect(() => {
      navigation.setOptions({
        title: "Cerrar Sesión",
      });
    });

  const handleLogout = () => {
    router.replace("/login");
    signOut(() => console.log("Logged out!"));
  };

  return (
    <View style={styles.container}>
      {/* Panel izquierdo con logo y eslogan */}
      <View style={styles.leftPanel}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.slogan}>donde Artistas y Clientes se encuentran</Text>
        </View>

      {/* Separador */}
      <View style={styles.separator} />

      {/* Panel derecho con mensaje y botón */}
      <View style={styles.rightPanel}>
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
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: colors.surfaceBase,
  },
  leftPanel: {
    flex: 1,
    backgroundColor: colors.brandPrimary,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  sloganContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  sloganLogo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
    logo: {
    width: 280,
    height: 280,
    marginBottom: -85,
  },
  slogan: {
    fontSize: 30,
    color: colors.accentInfo,
    textAlign: "center",
    fontWeight: "600",
  },
  separator: {
    width: 1,
    backgroundColor: "#ccc",
  },
  rightPanel: {
    flex: 1,
    paddingVertical: 40,
    paddingHorizontal: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 35,
    fontWeight: "600",
    marginBottom: 4,
    color: colors.brandPrimary,
    textAlign: "center",
  },
  subtext: {
    fontSize: 20,
    color: colors.brandSecondary,
    marginBottom: 24,
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: "#F05A7E",
    borderRadius: 12,
    paddingHorizontal: 30,
    paddingVertical: 8,
  },
  logoutLabel: {
    fontSize: 16,
    color: "#fff",
  },
});
