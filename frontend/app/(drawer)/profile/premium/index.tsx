import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import colors from "@/src/constants/colors";
import { useNavigation } from "expo-router";

export default function PremiumScreen() {
  const navigation = useNavigation();
  const [ElementsComponent, setElementsComponent] =
    useState<React.ComponentType<any> | null>(null);
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [SubscriptionForm, setSubscriptionForm] =
    useState<React.ComponentType<any> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    navigation.setOptions({ title: "💎 Activar Holos Premium" });
  }, [navigation]);

  useEffect(() => {
    const loadStripeSafely = async () => {
      if (!navigator.onLine) {
        setError("Estás sin conexión. No se puede cargar Stripe.");
        return;
      }

      try {
        const stripeLib = await import("@stripe/react-stripe-js");
        const stripeCore = await import("@stripe/stripe-js");
        const SubscriptionMod = await import(
          "@/src/components/checkout/SubscriptionForm"
        );

        setElementsComponent(() => stripeLib.Elements);
        setStripePromise(() =>
          stripeCore.loadStripe(
            "pk_test_51RA6BPP7ypDsDd4Vy9nMXXsM5unDbdLZRIgc9AFRXIp7xc7pAYizqg5XINqUlTjLnjdbyWjs64oxsVXWUfXso2bb00WkZJqZ9N"
          )
        );
        setSubscriptionForm(() => SubscriptionMod.default);
      } catch (err) {
        console.warn("Stripe failed to load:", err);
        setError("Hubo un error al cargar la pasarela de pago.");
      }
    };

    loadStripeSafely();
  }, []);

  return (
    <ProtectedRoute allowedRoles={["ARTIST", "ARTIST_PREMIUM"]}>
      {error ? (
        <Text style={{ padding: 24, color: "red" }}>{error}</Text>
      ) : !ElementsComponent || !stripePromise || !SubscriptionForm ? (
        <View style={{ padding: 24, alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.brandPrimary} />
          <Text style={{ marginTop: 12 }}>Cargando pasarela segura...</Text>
        </View>
      ) : (
        <ElementsComponent stripe={stripePromise}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.card}>
              <Text style={styles.title}>✨ Holos Premium ✨</Text>
              <View style={styles.divider} />
              <Text style={styles.subtitle}>
                ¡Accede a funciones exclusivas, menor comisión, y mucho más!
              </Text>
            </View>
            <SubscriptionForm />
          </ScrollView>
        </ElementsComponent>
      )}
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: colors.surfaceMuted,
    gap: 24,
  },
  card: {
    padding: 28,
    borderRadius: 20,
    width: "100%",
    maxWidth: 480,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.brandPrimary,
    marginBottom: 8,
  },
  divider: {
    height: 4,
    width: 80,
    backgroundColor: colors.brandPrimary,
    borderRadius: 4,
    marginVertical: 16,
  },
  subtitle: {
    fontSize: 16,
    color: colors.contentStrong,
    textAlign: "center",
    marginBottom: 20,
    maxWidth: 320,
  },
});
