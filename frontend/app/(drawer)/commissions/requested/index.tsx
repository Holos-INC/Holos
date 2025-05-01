import React, { useContext } from "react";
import { View, ScrollView, Text } from "react-native";
import { CommissionCard } from "@/src/components/requestedCommissions/CommissionCard";
import { indexStyles } from "@/src/styles/RequestedCommissions.styles";
import { CommissionInProgress } from "@/src/constants/CommissionTypes";
import { useRouter } from "expo-router";
import { AuthenticationContext } from "@/src/contexts/AuthContext";

export default function ClientCommissionsScreen({
  commissions,
}: {
  commissions: CommissionInProgress[];
}) {
  const { loggedInUser } = useContext(AuthenticationContext);
  const router = useRouter();

  const commissionsWithPaymentPending = commissions.filter((c) => c.waitingPayment);
  const commissionsWithoutPaymentPending = commissions.filter((c) => !c.waitingPayment);

  return (
    <ScrollView contentContainerStyle={indexStyles.container}>
      <View style={indexStyles.cardGrid}>
        {[...commissionsWithPaymentPending, ...commissionsWithoutPaymentPending].map(
          (commission: CommissionInProgress, index: number) => (
            <CommissionCard
              key={index}
              title={commission.name}
              image={commission.image ?? ""}
              artistUsername={commission.artistUsername}
              totalSteps={commission.totalSteps}
              currentStep={commission.currentStep}
              id={commission.id}
              waitingPayment={commission.waitingPayment}
            />
          )
        )}
      </View>
    </ScrollView>
  );
}

//router.push({ pathname: path, params: { commissionId: comm.id } });