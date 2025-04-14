import { Text, Pressable, StyleSheet, Animated, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import colors from "@/src/constants/colors";

export const PayButton = ({ onPress }: { onPress: () => void }) => {
  const [hovered, setHovered] = useState(false);
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (hovered) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1300,
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 700,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(0);
    }
  }, [hovered]);

  const scale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1.1],
  });

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  return (
    <View style={(styles.container, { marginTop: 10 })}>
      {hovered && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.glow,
            {
              transform: [{ scale }],
              opacity,
            },
          ]}
        />
      )}

      <Pressable
        onPress={onPress}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
        style={styles.button}
      >
        <Text style={styles.buttonText}>¡Pagar y comenzar la magia!</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#FFDE7D",
    borderRadius: 999,
    filter: "blur(15px)",
    zIndex: -1,
  },
  button: {
    backgroundColor: colors.brandSecondary,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderColor: "#EC6E00",
    borderRadius: 999,
    transitionDuration: "150ms",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
