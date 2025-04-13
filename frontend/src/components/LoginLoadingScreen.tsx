import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Animated,
} from "react-native";

export default function LoginLoadingScreen() {
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotation = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.spinnerContainer, { transform: [{ rotate: rotation }] }]}
      >
        <ActivityIndicator size="large" color="#333" />
      </Animated.View>
      <Text style={styles.loadingText}>Cargando...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // Fondo blanco minimalista
    justifyContent: "center",
    alignItems: "center",
  },
  spinnerContainer: {
    padding: 18,
    borderRadius: 40,
    backgroundColor: "#F2F2F2", // Gris claro para el fondo del spinner
    marginBottom: 15,
  },
  loadingText: {
    fontSize: 18,
    color: "#333", // Texto oscuro para mejor contraste
    marginTop: 10,
  },
});
