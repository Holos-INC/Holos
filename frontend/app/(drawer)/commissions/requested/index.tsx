import React from "react";
import { View, ScrollView, Text } from "react-native";
import { CommissionCard } from "@/src/components/requestedCommissions/CommissionCard";
import { indexStyles } from "@/src/styles/RequestedCommissions.styles";
import { CommissionInProgress } from "@/src/constants/CommissionTypes";

export default function ClientCommissionsScreen({commissions}: {commissions: CommissionInProgress[]}) {
  return (
    <ScrollView contentContainerStyle={indexStyles.container}>
        <View style={indexStyles.cardGrid}>
            {commissions.length === 0 ? (
                <Text style={indexStyles.emptyText}>¡Aún no hiciste ningún encargo! 😿</Text>
            ) : (
                commissions.map((commission: CommissionInProgress, index: number) => (
                <CommissionCard
                    key={index}
                    title={commission.name}
                    image={`data:image/jpeg;base64,${commission.image}`}
                    artistUsername={commission.artistUsername}
                    totalSteps={commission.totalSteps}
                    currentStep={commission.currentStep}
                />
                ))
            )}
        </View>
    </ScrollView>
  );
};
