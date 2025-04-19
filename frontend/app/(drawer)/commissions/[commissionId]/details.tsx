import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet, Text } from "react-native";
import { Button } from "react-native-paper";

import LoadingScreen from "@/src/components/LoadingScreen";
import PaymentDetails from "@/src/components/checkout/PaymentDetails";
import { ProgressDots } from "@/src/components/requestedCommissions/ProgressDots";

import colors from "@/src/constants/colors";
import { CommissionDTO } from "@/src/constants/CommissionTypes";
import { getCommissionById } from "@/src/services/commisionApi";
import { styles } from "@/src/styles/CommissionAcceptedDetails.styles";

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

  
  useEffect(() => {
    if (!numericId) return;
    const fetchCommission = async () => {
      try {
        const data = await getCommissionById(numericId);
        setCommission(data);
      } catch (err: any) {
        setError(err.message || "No se pudo cargar la comisión.");
      } finally {
        setLoading(false);
      }
    };
    fetchCommission();
  }, [numericId]);

  
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

  
  const step = Number(currentStep) || 0;
  const steps = Number(totalSteps) || 0;

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
      </View>
    </ScrollView>
  );
}


