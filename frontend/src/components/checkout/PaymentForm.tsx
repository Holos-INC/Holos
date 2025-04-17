import React, { useContext, useState } from "react";
import { useRouter } from "expo-router";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import { useStripePayment } from "@/src/hooks/useStripePayment";
import { createPaymentIntent } from "@/src/services/stripeApi";
import PaymentFormLayout from "@/src/components/checkout/PaymentFormLayout";
import { payCommissionById } from "@/src/services/commisionApi";
import StripeSafeWrapper from "./StripeSafeWrapper";

interface PaymentFormProps {
  amount: number;
  commissionId: number;
  description: string;
  status: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  commissionId,
  description,
  status,
}) => {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const { loggedInUser } = useContext(AuthenticationContext);
  const { getPaymentMethod, error, loading, setError } = useStripePayment();

  const handlePayPress = async (
    stripe: any,
    elements: any,
    CardElement: React.ComponentType<any>
  ) => {
    if (!stripe || !elements) {
      setError("Stripe aún no está listo 😿");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError("No se pudo encontrar el formulario de tarjeta 😿");
      return;
    }

    const { error: stripeError, paymentMethod } =
      await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });
    if (!stripe) {
      setError("Stripe aún no está listo 😿" + stripeError);
      return;
    }
    if (status != "NOT_PAID_YET") {
      setError("Esta comisión ya fue pagada o no está disponible para pago.");
      return;
    }

    try {
      const paymentDTO = { amount: Math.round(amount * 100), description };
      const secret = await createPaymentIntent(
        paymentDTO,
        commissionId,
        loggedInUser.token
      );

      const result = await stripe.confirmCardPayment(secret, {
        payment_method: paymentMethod.id,
      });

      if (result.error) {
        setError(result.error.message || "Ocurrió un error 😿");
      } else if (result.paymentIntent?.status === "succeeded") {
        setSuccess(true);
        const error = await payCommissionById(commissionId);
        if (result.error) {
          setError(error ? String(error) : "Ocurrió un error 😿");
        }
        setTimeout(() => router.replace("/"), 2500);
      }
    } catch (e) {
      setError("No se pudo completar el pago 😿");
    }
  };

  return (
    <StripeSafeWrapper>
      {(CardElement, stripe, elements) => (
        <PaymentFormLayout
          title="Tarjetas aceptadas:"
          onPress={() => handlePayPress(stripe, elements, CardElement)}
          loading={loading}
          success={success}
          error={error}
          CardElement={CardElement}
        />
      )}
    </StripeSafeWrapper>
  );
};

export default PaymentForm;
