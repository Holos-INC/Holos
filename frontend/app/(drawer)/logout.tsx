import React, { useContext } from "react";
import { View, Text, StyleSheet, Image, ScrollView, useWindowDimensions } from "react-native";
import { Button } from "react-native-paper";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import { useRouter } from "expo-router";
import colors from "@/src/constants/colors";
import { useEffect } from "react";
import { useNavigation } from "expo-router";
import { useFonts, DancingScript_400Regular } from "@expo-google-fonts/dancing-script";

export default function LogoutScreen() {
  const { signOut } = useContext(AuthenticationContext);
  const router = useRouter();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;
  const [fontsLoaded] = useFonts({DancingScript_400Regular});
  
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
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={[styles.container, { flexDirection: isSmallScreen ? "column" : "row" }]}>
        {/* Panel izquierdo con logo y eslogan */}
        <View style={styles.leftPanel}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.slogan, { fontFamily: "DancingScript_400Regular", fontSize: isSmallScreen ? 36 : 60 }]}>donde Artistas y Clientes se encuentran🎨</Text>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: colors.surfaceBase,
  },
  leftPanel: {
    flex:1,
    backgroundColor: colors.brandPrimary,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
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
    color: colors.accentInfo,
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 50
  },
  separator: {
    width: 1,
    backgroundColor: "#ccc",
  },
  rightPanel: {
    flex:1,
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
