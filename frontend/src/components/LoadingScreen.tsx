import { View, Text, ActivityIndicator, StyleSheet, Animated } from "react-native";
import { useEffect, useRef } from "react";

export default function LoadingScreen() {
  const bounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, { toValue: -10, duration: 400, useNativeDriver: true }),
        Animated.timing(bounce, { toValue: 0, duration: 400, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.loadingText, { transform: [{ translateY: bounce }] }]}>
        Cargando...
      </Animated.Text>
      <ActivityIndicator size="large" color="#ff80bf" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fffaf0",
  },
  loadingText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ff80bf",
    marginBottom: 10,
  },
});
