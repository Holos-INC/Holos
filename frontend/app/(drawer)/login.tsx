import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, useWindowDimensions } from "react-native";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import colors from "@/src/constants/colors";
import { useEffect } from "react";
import { useNavigation } from "expo-router";
import { useFonts, DancingScript_400Regular } from "@expo-google-fonts/dancing-script";



export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;
  const [fontsLoaded] = useFonts({DancingScript_400Regular});

  useEffect(() => {
    navigation.setOptions({
      title: isLogin ? "Inicio de Sesión" : "Registro",
    });
  }, [isLogin]);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={[styles.container, { flexDirection: isSmallScreen ? "column" : "row" }]}>
        {/* Panel Izquierdo: Imagen y eslogan */}
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

        {/* Panel Derecho: Formulario */}
        <View style={styles.rightPanel}>
          {isLogin ? (
            <>
              <LoginForm />
              <TouchableOpacity onPress={() => setIsLogin(false)}>
                <Text style={styles.toggleText}>¿No tienes cuenta? Regístrate</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <SignupForm onSignupSuccess={() => setIsLogin(true)} />
              <TouchableOpacity onPress={() => setIsLogin(true)}>
                <Text style={styles.toggleText}>¿Ya tienes cuenta? Inicia sesión</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceBase,
  },
  leftPanel: {
    flex:1,
    backgroundColor: colors.brandPrimary,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
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
  sloganLogo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
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
  },
  toggleText: {
    textAlign: "center",
    color: colors.brandPrimary,
    marginTop: 24,
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
});