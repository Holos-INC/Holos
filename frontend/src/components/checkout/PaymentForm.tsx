import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { createPaymentIntent } from "@/src/services/stripeApi";
import colors from "@/src/constants/colors";
import { useRouter } from "expo-router";
import { AuthenticationContext } from "@/src/contexts/AuthContext";

interface PaymentFormProps {
  amount: number;
  commissionId: number;
  description: string;
}

const acceptedCards = [
  "Visa",
  "MasterCard",
  "American Express",
  "Diners",
];

const PaymentForm: React.FC<PaymentFormProps> = ({ amount, commissionId, description }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { loggedInUser } = useContext(AuthenticationContext);

  const handlePayPress = async () => {
    setError(null);
    setSuccess(false);

    if (!stripe || !elements) {
      setError("Stripe no está disponible 😿");
      return;
    }

    try {
      const paymentDTO = { amount: Math.round(amount*100), description };
      const secret = await createPaymentIntent(paymentDTO, commissionId, loggedInUser.token);

      const result = await stripe.confirmCardPayment(secret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        setError(result.error.message || "Ocurrió un error 😿");
      } else if (result.paymentIntent?.status === "succeeded") {
        setSuccess(true);
        setTimeout(() => {
            router.replace('/');
        }, 2500);
      }
    } catch (err) {
      setError("No se pudo completar el pago 😿");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.instructionBox}>
        <Text style={styles.instructionHeader}>Tarjetas aceptadas:</Text>
        <View style={styles.instructionList}>
          {acceptedCards.map((card) => (
            <Text style={styles.cardBrand}>· {card}</Text>
          ))}
        </View>
      </View>

      <CardElement options={{ style: cardElementStyle }} />

      <TouchableOpacity onPress={handlePayPress} style={styles.button}>
        <Text style={styles.buttonText}>Pagar ahora</Text>
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}
      {success && <Text style={styles.success}>¡Pago realizado con éxito!</Text>}
    </View>
  );
};

export default PaymentForm;

const cardElementStyle = {
  base: {
    fontSize: "16px",
    color: colors.contentStrong,
    fontFamily: "'Inter', sans-serif", '::placeholder': { color: colors.accentInfo },
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
  instructionItem: {
    color: colors.contentStrong,
    fontSize: 14,
    lineHeight: 20,
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
