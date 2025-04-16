import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

interface Props {
  children: (CardElement: React.ComponentType<any>) => React.ReactNode;
}

const StripeSafeWrapper: React.FC<Props> = ({ children }) => {
  const [CardElement, setCardElement] =
    useState<React.ComponentType<any> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStripe = async () => {
      try {
        if (!navigator.onLine) {
          setError("Estás sin conexión. Conéctate para pagar con tarjeta.");
          return;
        }

        const stripeModule = await import("@stripe/react-stripe-js");
        setCardElement(() => stripeModule.CardElement);
      } catch (err) {
        console.warn("Stripe load error:", err);
        setError("Stripe no está disponible. Revisa tu conexión.");
      }
    };

    loadStripe();
  }, []);

  if (error) {
    return (
      <View>
        <Text style={{ color: "red", fontWeight: "bold", marginBottom: 8 }}>
          {error}
        </Text>
      </View>
    );
  }

  return CardElement ? (
    <>{children(CardElement)}</>
  ) : (
    <Text>Cargando pasarela segura...</Text>
  );
};

export default StripeSafeWrapper;
