import React, { useContext, useState } from "react";
import { useRouter } from "expo-router";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import { useStripePayment } from "@/src/hooks/useStripePayment";
import { createSetupIntent } from "@/src/services/stripeApi";
import PaymentFormLayout from "@/src/components/checkout/PaymentFormLayout";
import { payCommissionById } from "@/src/services/commisionApi";
import StripeSafeWrapper from "./StripeSafeWrapper";

interface PaymentFormProps {
  amount: number;
  commissionId: number;
  description: string;
  status: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ commissionId, status }) => {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const { loggedInUser } = useContext(AuthenticationContext);
  const { error, loading, setError } = useStripePayment();

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

    if (status !== "NOT_PAID_YET") {
      setError("Esta comisión ya fue pagada o no está disponible para pago.");
      return;
    }

    const { error: stripeError, paymentMethod } =
      await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

    if (stripeError || !paymentMethod) {
      setError(stripeError?.message || "Error al crear el método de pago 😿");
      return;
    }

    try {
      const clientSecret = await createSetupIntent(
        commissionId,
        loggedInUser.token
      );

      const result = await stripe.confirmCardSetup(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (result.error) {
        setError(result.error.message || "Ocurrió un error 😿");
      } else if (result.setupIntent?.status === "succeeded") {
        setSuccess(true);

        const error = await payCommissionById(commissionId); // Esto hace el cobro real en backend
        if (error) {
          setError(String(error));
        } else {
          router.replace("/");
        }
      }
    } catch (e) {
      console.log(e);
      const message =
        e instanceof Error
          ? e.message
          : typeof e === "string"
          ? e
          : "Ocurrió un error inesperado 😿";
      setError(message);
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
