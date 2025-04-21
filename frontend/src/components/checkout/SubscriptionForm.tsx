import React, { useContext, useState } from "react";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import { useStripePayment } from "@/src/hooks/useStripePayment";
import { createSubscription } from "@/src/services/stripeApi";
import PaymentFormLayout from "@/src/components/checkout/PaymentFormLayout";
import StripeSafeWrapper from "./StripeSafeWrapper";

const SubscriptionForm = () => {
  const [success, setSuccess] = useState(false);
  const { loggedInUser } = useContext(AuthenticationContext);
  const { getPaymentMethod, error, loading, setError } = useStripePayment();

  const handleSubscribe = async () => {
    const paymentMethodId = await getPaymentMethod();
    if (!paymentMethodId) return;

    try {
      await createSubscription(paymentMethodId, loggedInUser.token);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("No se pudo activar la suscripción 😿");
    }
  };

  return (
    <StripeSafeWrapper>
      {(CardElement) => (
        <PaymentFormLayout
          title="Activa tu suscripción Premium"
          onPress={handleSubscribe}
          loading={loading}
          error={error}
          success={success}
          buttonLabel="Suscribirme"
          acceptedCards={["Visa", "MasterCard", "American Express", "Diners"]}
          CardElement={CardElement}
        />
      )}
    </StripeSafeWrapper>
  );
};

export default SubscriptionForm;
