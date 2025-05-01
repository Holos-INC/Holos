import React from "react";
import { View, Text, Image } from "react-native";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";

import { ProgressDots } from "@/src/components/requestedCommissions/ProgressDots";
import { commissionCardstyles as styles } from "@/src/styles/RequestedCommissions.styles";
import { getImageSource } from "@/src/utils/getImageSource";

type CommissionCardProps = {
  id: number;
  title: string;
  image: string;
  artistUsername: string;
  totalSteps: number;
  currentStep: number;
  waitingPayment: boolean;
};

export const CommissionCard: React.FC<CommissionCardProps> = ({
  id,
  title,
  image,
  artistUsername,
  totalSteps,
  currentStep,
  waitingPayment,
}) => {
  const router = useRouter();

  const goToDetails = () =>
    router.push({
      pathname: "/commissions/[commissionId]/details",
      params: {
        commissionId: id.toString(),
        currentStep,
        totalSteps,
      },
    });

  const goToChat = () => router.push(`/chats/${id}`);

  return (
    <View style={styles.card}>
      <Image source={getImageSource(image)} style={styles.image} />

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.artist}>por @{artistUsername}</Text>
        </View>

        {waitingPayment && (
          <Text style={{ color: "red", fontWeight: "bold", marginBottom: 8 }}>
            ¡Pago pendiente!
          </Text>
        )}

        <ProgressDots totalSteps={totalSteps} currentStep={currentStep} />
        <Text style={styles.counter}>
          {currentStep}/{totalSteps}
        </Text>

        <View style={styles.buttonRow}>
          <Button
            mode="contained"
            buttonColor="#183771"
            textColor="#FECEF1"
            onPress={goToDetails}
            style={{ flex: 1 }}
          >
            Detalles
          </Button>
          <View style={{ width: 12 }} />
          <Button
            mode="outlined"
            textColor="#183771"
            onPress={goToChat}
            style={{ flex: 1 }}
          >
            Chat
          </Button>
        </View>
      </View>
    </View>
  );
};
