import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import SubscriptionForm from "@/src/components/checkout/SubscriptionForm";
import colors from "@/src/constants/colors";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigation } from "expo-router";

const stripePromise = loadStripe('pk_test_51RA6BPP7ypDsDd4Vy9nMXXsM5unDbdLZRIgc9AFRXIp7xc7pAYizqg5XINqUlTjLnjdbyWjs64oxsVXWUfXso2bb00WkZJqZ9N');

export default function PremiumScreen() {
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ title: '💎 Activar Holos Premium' });
    }, [navigation]);

    return (
      <ProtectedRoute allowedRoles={['ARTIST']}>
        <Elements stripe={stripePromise}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.card}>
                <Text style={styles.title}>✨ Holos Premium ✨</Text>
                <View style={styles.divider} />
                <Text style={styles.subtitle}>
                    ¡Accede a funciones exclusivas, menor comisión, y mucho más!
                </Text>
                <SubscriptionForm />
            </View>
            </ScrollView>
        </Elements>
      </ProtectedRoute>
    );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.surfaceBase,
  },
  card: {
    backgroundColor: '#fff',
    padding: 28,
    borderRadius: 20,
    shadowColor: colors.brandSecondary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
    width: '100%',
    maxWidth: 480,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
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
    textAlign: 'center',
    marginBottom: 20,
    maxWidth: 320,
  },
});
