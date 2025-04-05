import React, { useContext, useState } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import { useRouter } from "expo-router";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import { useStripePayment } from "@/src/hooks/useStripePayment";
import { createPaymentIntent } from "@/src/services/stripeApi";
import PaymentFormLayout from "@/src/components/checkout/PaymentFormLayout";

interface PaymentFormProps {
  amount: number;
  commissionId: number;
  description: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ amount, commissionId, description }) => {
  const stripe = useStripe();
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const { loggedInUser } = useContext(AuthenticationContext);
  const { getPaymentMethod, error, loading, setError } = useStripePayment();

  const handlePayPress = async () => {
    const paymentMethodId = await getPaymentMethod();
    if (!paymentMethodId) return;

    if (!stripe) {
      setError("Stripe aún no está listo 😿");
      return;
    }

    try {
      const paymentDTO = { amount: Math.round(amount * 100), description };
      const secret = await createPaymentIntent(paymentDTO, commissionId, loggedInUser.token);

      const result = await stripe.confirmCardPayment(secret, {
        payment_method: paymentMethodId,
      });

      if (result.error) {
        setError(result.error.message || "Ocurrió un error 😿");
      } else if (result.paymentIntent?.status === "succeeded") {
        setSuccess(true);
        setTimeout(() => router.replace("/"), 2000);
      }
    } catch (e) {
      setError("No se pudo completar el pago 😿");
    }
  };

  return (
    <PaymentFormLayout
      title="Tarjetas aceptadas:"
      onPress={handlePayPress}
      loading={loading}
      success={success}
      error={error}
    />
  );
};

export default PaymentForm;
