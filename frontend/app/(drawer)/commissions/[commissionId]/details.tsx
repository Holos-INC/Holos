import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { ScrollView, View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

import LoadingScreen from "@/src/components/LoadingScreen";
import PaymentDetails from "@/src/components/checkout/PaymentDetails";
import { ProgressDots } from "@/src/components/requestedCommissions/ProgressDots";

import colors from "@/src/constants/colors";
import { CommissionDTO } from "@/src/constants/CommissionTypes";
import { getCommissionById, declinePayment } from "@/src/services/commisionApi";
import { styles } from "@/src/styles/CommissionAcceptedDetails.styles";
import { payCommissionFromSetupIntent } from "@/src/services/stripeApi";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import { cancelCommission } from "@/src/services/commisionApi";

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

  const [confirmType, setConfirmType] = useState<"pay" | "decline" | null>(null);

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
      await fetchCommission();
    } catch (err: any) {
      setError(err.message || "Error al cancelar el pago.");
    }
  };

  const confirmPayment = () => setConfirmType("pay");
  const confirmDeclinePayment = () => setConfirmType("decline");

  const handleConfirmAction = async () => {
    setConfirmType(null);
    if (confirmType === "pay") {
      await handlePayment();
    } else if (confirmType === "decline") {
      await handleDeclinePayment();
    }
  };

  const handleCancelCommission = async () => {
    try {
      if (!token || isNaN(numericId)) {
        setError("No se puede cancelar la comisión.");
        return;
      }
      await cancelCommission(numericId, token);
      alert("Comisión cancelada correctamente.");
      router.back(); // o usa fetchCommission() si quieres recargar la pantalla en lugar de volver
    } catch (err: any) {
      setError(err.message || "Error al cancelar la comisión.");
    }
  };
  

  const step = Number(currentStep) || 0;
  const steps = Number(totalSteps) || 0;
  const isClient = commission.clientUsername === loggedInUser?.username;

  const showDeclineButton =
    commission.paymentArrangement === "MODERATOR" ||
    commission.paymentArrangement === "FINAL" ||
    (commission.paymentArrangement === "FIFTYFIFTY" && commission.currentPayments === 1);

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

        <Button
          mode="outlined"
          buttonColor="#FF4444"
          textColor="white"
          style={{ marginTop: 12 }}
          onPress={handleCancelCommission}
        >
          Cancelar comisión
        </Button>


        {commission.isWaitingPayment && isClient && (
          <View style={{ flexDirection: "row", marginTop: 12, gap: 12 }}>
            <Button
              mode="contained"
              buttonColor={colors.brandSecondary}
              textColor="white"
              style={{ flex: 1 }}
              onPress={confirmPayment}
            >
              Realizar pago
            </Button>
            {showDeclineButton && (
              <Button
                mode="contained"
                buttonColor="#CCCCCC"
                textColor="#333"
                style={{ flex: 1 }}
                onPress={confirmDeclinePayment}
              >
                Rechazar pago
              </Button>
            )}
          </View>
        )}
      </View>

      <Modal
        transparent
        visible={!!confirmType}
        animationType="fade"
        onRequestClose={() => setConfirmType(null)}
      >
        <View style={stylesModal.overlay}>
          <View style={stylesModal.modal}>
            <Text style={stylesModal.title}>
              {confirmType === "pay" ? "Confirmar pago" : "Rechazar pago"}
            </Text>
            <Text style={stylesModal.message}>
              {confirmType === "pay"
                ? <Text>
                  Esta acción corresponde al pago {!commission.currentPayments ? 1 : commission.currentPayments + 1} de {commission.totalPayments} de la comisión.
                  Se abonarán {((Number(commission.price) || 0) /(Number(commission.totalPayments) || 1)).toFixed(2)}€ al artista.
                </Text>
                : <Text>
                Esta acción cancelará el pago pendiente
              </Text>}
            </Text>
            <View style={stylesModal.buttons}>
              <TouchableOpacity onPress={() => setConfirmType(null)}>
                <Text style={stylesModal.cancel}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirmAction}>
                <Text style={stylesModal.confirm}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const stylesModal = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 20,
  },
  modal: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    marginBottom: 20,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
  },
  cancel: {
    color: "#888",
    fontSize: 16,
    marginRight: 16,
  },
  confirm: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

