import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ProgressDots } from "@/src/components/requestedCommissions/ProgressDots";
import { commissionCardstyles as styles } from "@/src/styles/RequestedCommissions.styles";
import { getImageSource } from "@/src/utils/getImageSource";
import {
  UpdateStatus,
  UpdateStatusColors,
} from "@/src/constants/CommissionTypes";
import { UpdateStatusBadge } from "../UpdateStatusBadge";

type CommissionCardProps = {
  id: number;
  title: string;
  image: string;
  artistUsername: string;
  totalSteps: number;
  currentStep: number;
  waitingPayment: boolean;
  lastUpdateStatus: UpdateStatus;
};

export const CommissionCard: React.FC<CommissionCardProps> = ({
  id,
  title,
  image,
  artistUsername,
  totalSteps,
  currentStep,
  waitingPayment,
  lastUpdateStatus,
}) => {
  const router = useRouter();

  const goToChat = () => router.push(`/chats/${id}`);

  return (
    <View style={styles.card}>
      <Pressable onPress={goToChat} style={{ position: "relative" }}>
        <Image source={getImageSource(image)} style={styles.image} />
        <UpdateStatusBadge status={lastUpdateStatus} />
      </Pressable>

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
      </View>
    </View>
  );
};
