import React from "react";
import { View, Text, StyleSheet } from "react-native";

const AccessDenied = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🎨🚫</Text>
      <Text style={styles.title}>¡Alto ahí, artista rebelde!</Text>
      <Text style={styles.message}>
      Tu arte es increíble, pero no tienes autorización para exponer en esta sala. 
      ¡Solo los elegidos pueden entrar! 🖼️🚫
      </Text>
      <Text style={styles.subtext}>
        Si crees que esto es un error, habla con el equipo de soporte.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#fff0f5",
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#b22222",
    textAlign: "center",
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    textAlign: "center",
    color: "#333",
    paddingHorizontal: 16,
  },
  subtext: {
    marginTop: 16,
    fontSize: 14,
    fontStyle: "italic",
    color: "#666",
    textAlign: "center",
  },
});

export default AccessDenied;
