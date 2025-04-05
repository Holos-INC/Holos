import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";

export function useStripePayment() {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getPaymentMethod = async (): Promise<string | null> => {
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe no está disponible 😿");
      return null;
    }

    setLoading(true);

    const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement)!,
    });

    setLoading(false);

    if (stripeError || !paymentMethod) {
      setError(stripeError?.message || "No se pudo crear el método de pago");
      return null;
    }

    return paymentMethod.id;
  };

  return { getPaymentMethod, error, loading, setError };
}
