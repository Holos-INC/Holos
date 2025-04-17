import React from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import colors from "@/src/constants/colors";

type ActionButtonsProps = {
  isClient: boolean;
  isCurrentUser: boolean;
  username?: string;
};

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isClient,
  isCurrentUser,
  username,
}) => {
  const router = useRouter();

  if (isClient) return null;

  if (isCurrentUser) {
    return (
      <View
        style={{
          margin: 10,
          flexDirection: "row",
          alignSelf: "center",
          gap: 10,
        }}
      >
        <Button
          icon={"crown"}
          mode="contained"
          buttonColor={colors.brandPrimary}
          style={{ padding: 5 }}
          labelStyle={{ fontWeight: "bold", fontSize: 16 }}
          onPress={() => router.push(`/profile/premium`)}
        >
          Holos Premium
        </Button>
        <Button
          icon={"credit-card"}
          mode="contained"
          buttonColor={colors.brandPrimary}
          style={{ padding: 5 }}
          labelStyle={{ fontWeight: "bold", fontSize: 16 }}
          onPress={() => router.push(`/profile/stripe-setup`)}
        >
          Conectar Stripe
        </Button>
      </View>
    );
  }

  return (
    <Button
      icon={"email"}
      mode="contained"
      buttonColor={colors.brandSecondary}
      style={{ padding: 5, alignSelf: "center" }}
      labelStyle={{ fontWeight: "bold", fontSize: 16 }}
      onPress={() => router.push(`/commissions/request/${username}`)}
    >
      Solicitar trabajo personalizado
    </Button>
  );
};

export default ActionButtons;
