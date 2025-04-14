import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Image,
} from "react-native";
import { useState, useEffect, useContext } from "react";
import {
  createStripeAccount,
  getStripeAccountLink,
} from "@/src/services/stripeApi";
import colors from "@/src/constants/colors";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useNavigation } from "expo-router";
import { AuthenticationContext } from "@/src/contexts/AuthContext";

export default function StripeSetupScreen() {
  const { loggedInUser } = useContext(AuthenticationContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scale = useSharedValue(1);
  const navigation = useNavigation();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withSpring(0.95);
  };
  const onPressOut = () => {
    scale.value = withSpring(1);
  };

  const handleStripeConnect = async () => {
    try {
      setLoading(true);
      setError(null);
      await createStripeAccount(loggedInUser.token);
      const url = await getStripeAccountLink();
      window.location.href = url;
    } catch (err: any) {
      console.error(err);
      setError("No pudimos completar la conexión 😿");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    navigation.setOptions({ title: "💳 Conectar Stripe" });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Solo falta un paso 💫</Text>
      <Text style={styles.description}>
        Para empezar a recibir pagos a través de Holos, necesitas conectar una
        cuenta de Stripe.{"\n"}
        ¡Es rápido, seguro y totalmente gratis!
      </Text>

      {error && <Text style={styles.error}>{error}</Text>}

      <Animated.View style={[styles.buttonWrapper, animatedStyle]}>
        <Pressable
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={handleStripeConnect}
          disabled={loading}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Activar pagos con Stripe</Text>
        </Pressable>
      </Animated.View>

      <Image
        source={require("@/assets/images/logo.png")}
        style={styles.backgroundImage}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
  },
  backgroundImage: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 200,
    height: 200,
    opacity: 0.5,
    zIndex: -1,
  },
  icon: {
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 12,
    color: colors.contentStrong,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: colors.contentStrong,
    opacity: 0.85,
    marginBottom: 24,
    textAlign: "center",
  },
  error: {
    color: "#cc0000",
    marginBottom: 12,
  },
  buttonWrapper: {
    borderRadius: 16,
    overflow: "hidden",
  },
  button: {
    backgroundColor: colors.brandPrimary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
    minWidth: 240,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
