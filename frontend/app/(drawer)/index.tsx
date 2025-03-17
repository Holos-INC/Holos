import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen({ }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bienvenido a la pantalla principal</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, alignItems: "center" },
  text: { marginTop: 50, fontSize: 18 },
});
