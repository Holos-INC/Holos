import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { ScrollView, View, Text } from "react-native";
import { Button } from "react-native-paper";

import LoadingScreen from "@/src/components/LoadingScreen";
import PaymentDetails from "@/src/components/checkout/PaymentDetails";
import { ProgressDots } from "@/src/components/requestedCommissions/ProgressDots";

import colors from "@/src/constants/colors";
import { CommissionDTO } from "@/src/constants/CommissionTypes";
import { getCommissionById } from "@/src/services/commisionApi";
import { declinePayment } from "@/src/services/commisionApi";
import { styles } from "@/src/styles/CommissionAcceptedDetails.styles";
import { payCommissionFromSetupIntent } from "@/src/services/stripeApi";
import { AuthenticationContext } from "@/src/contexts/AuthContext";

export default function CommissionAcceptedDetailsScreen() {

  const { commissionId, currentStep, totalSteps } = useLocalSearchParams<{
    commissionId: string;
    currentStep?: string;
    totalSteps?: string;
  }>();

  const numericId = Number(commissionId);


  const [commission, setCommission] = useState<CommissionDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation();
  const router = useRouter();

  const { loggedInUser } = useContext(AuthenticationContext);
  const token = loggedInUser?.token;


  const fetchCommission = async () => {
    try {
      const data = await getCommissionById(numericId);
      console.log("Respuesta del backend:", data);
      setCommission(data);
    } catch (err: any) {
      setError(err.message || "No se pudo cargar la comisión.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!commissionId || isNaN(numericId)) {
      setError("ID inválido");
      setLoading(false);
      return;
    }
    fetchCommission();
  }, [commissionId]);

  useEffect(() => {
    navigation.setOptions({
      title: commission?.name ? `Detalles: ${commission.name}` : "Detalles",
    });
  }, [commission?.name, navigation]);

  if (loading) return <LoadingScreen />;
  if (error || !commission)
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>{error ?? "No encontrado"}</Text>
      </View>
    );

  const handlePayment = async () => {
    try {
      if (!token || isNaN(numericId)) {
        setError("No se puede procesar el pago.");
        return;
      }
      await payCommissionFromSetupIntent(numericId, token);
      alert("Se realizó el pago correctamente");
      await fetchCommission();
    } catch (err: any) {
      setError(err.message || "Error al procesar el pago.");
    }
  };

  const handleDeclinePayment = async () => {
    try {
      if (!token || isNaN(numericId)) {
        setError("No se puede cancelar el pago.");
        return;
      }
      await declinePayment(numericId, token);
      alert("Se canceló el pago correctamente");
      await fetchCommission()
    } catch (err: any) {
      setError(err.message || "Error al cancelar el pago.");
    }
  };

  const step = Number(currentStep) || 0;
  const steps = Number(totalSteps) || 0;
  const isClient = commission.clientUsername === loggedInUser?.username;

  const showDeclineButton = commission.paymentArrangement==="MODERATOR"||
                          commission.paymentArrangement==="FINAL"||
                          (commission.paymentArrangement==="FIFTYFIFTY"&&commission.currentPayment===1)

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.card}>

        <PaymentDetails commission={commission} />


        {steps > 0 && (
          <View style={styles.progressSection}>
            <ProgressDots totalSteps={steps} currentStep={step} />
            <Text style={{ color: colors.contentStrong }}>
              Progreso: {step}/{steps}
            </Text>
          </View>
        )}
        <Button
          mode="contained"
          buttonColor={colors.brandPrimary}
          textColor="white"
          style={{ marginTop: 24 }}
          onPress={() => router.push(`/chats/${numericId}`)}
        >
          Ir al chat
        </Button>

        {commission.isWaitingPayment && isClient && (
          <View style={{ flexDirection: "row", marginTop: 12, gap: 12 }}>
            <Button
              mode="contained"
              buttonColor={colors.brandSecondary}
              textColor="white"
              style={{ flex: 1 }}
              onPress={handlePayment}
            >
              Pagar etapa
            </Button>
            {showDeclineButton &&
            <Button
              mode="contained"
              buttonColor="#CCCCCC"
              textColor="#333"
              style={{ flex: 1 }}
              onPress={handleDeclinePayment}
            >
              Rechazar pago
            </Button>}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

