import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { CardElement } from "@stripe/react-stripe-js";
import colors from "@/src/constants/colors";

interface PaymentFormLayoutProps {
  title: string;
  onPress: () => void;
  loading: boolean;
  success?: boolean;
  error?: string | null;
  buttonLabel?: string;
  acceptedCards?: string[];
}

const defaultAcceptedCards = ["Visa", "MasterCard", "American Express", "Diners"];

const PaymentFormLayout: React.FC<PaymentFormLayoutProps> = ({
  title,
  onPress,
  loading,
  success,
  error,
  buttonLabel = "Pagar ahora",
  acceptedCards = defaultAcceptedCards,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.instructionBox}>
        <Text style={styles.instructionHeader}>{title}</Text>
        <View style={styles.instructionList}>
          {acceptedCards.map((card) => (
            <Text key={card} style={styles.cardBrand}>· {card}</Text>
          ))}
        </View>
      </View>

      <CardElement options={{ style: cardElementStyle }} />

      <TouchableOpacity
        onPress={onPress}
        style={[styles.button, loading && { opacity: 0.5 }]}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Procesando..." : buttonLabel}
        </Text>
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}
      {success && <Text style={styles.success}>¡Pago realizado con éxito! 🎉</Text>}
    </View>
  );
};

export default PaymentFormLayout;

const cardElementStyle = {
  base: {
    fontSize: "16px",
    color: colors.contentStrong,
    fontFamily: "'Inter', sans-serif",
    '::placeholder': { color: colors.accentInfo },
  },
  invalid: {
    color: colors.brandPrimary,
    iconColor: colors.brandPrimary,
  },
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 24,
    backgroundColor: colors.surfaceBase,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  instructionBox: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  instructionHeader: {
    color: colors.contentStrong,
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
  },
  instructionList: {
    gap: 4,
  },
  cardBrand: {
    fontWeight: "bold",
    color: colors.brandPrimary,
  },
  button: {
    backgroundColor: colors.brandPrimary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  error: {
    fontSize: 14,
    color: colors.brandPrimary,
    marginTop: 12,
  },
  success: {
    fontSize: 14,
    color: colors.brandSecondary,
    marginTop: 12,
  },
});
