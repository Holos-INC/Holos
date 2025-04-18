import React from "react";
import { View, Text, Image } from "react-native";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";

import { ProgressDots } from "@/src/components/requestedCommissions/ProgressDots";
import { commissionCardstyles as styles } from "@/src/styles/RequestedCommissions.styles";

type CommissionCardProps = {
  id: number;
  title: string;
  image: string;
  artistUsername: string;
  totalSteps: number;
  currentStep: number;
};

export const CommissionCard: React.FC<CommissionCardProps> = ({
  id,
  title,
  image,
  artistUsername,
  totalSteps,
  currentStep,
}) => {
  const router = useRouter();

  /** IMPORTANTE: usamos el placeholder [commissionId] en pathname */
  const goToDetails = () =>
    router.push({
      pathname: "/commissions/[commissionId]/details",
      params: {
        commissionId: id.toString(),
        currentStep,
        totalSteps,
      },
    });

  /** idem para el chat (si tuvieras tipos estrictos también)  */
  const goToChat = () => router.push(`/chats/${id}`);

  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.artist}>por @{artistUsername}</Text>
        </View>

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

