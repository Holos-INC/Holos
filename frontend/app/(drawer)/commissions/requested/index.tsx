import React, { useContext, useEffect, useState } from "react";
import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import { CommissionCard } from "@/src/components/requestedCommissions/CommissionCard";
import { indexStyles } from "@/src/styles/RequestedCommissions.styles";
import { CommissionInProgress } from "@/src/constants/CommissionTypes";
import { useRouter } from "expo-router";  
import { AuthenticationContext } from "@/src/contexts/AuthContext";


export default function ClientCommissionsScreen({commissions}: {commissions: CommissionInProgress[]}) {
    const { loggedInUser } = useContext(AuthenticationContext);
    const router = useRouter();  // Usamos useRouter de expo-router
    const token = loggedInUser.token;

  return (
    <ScrollView contentContainerStyle={indexStyles.container}>
        <View style={indexStyles.cardGrid}>
            {commissions.length === 0 ? (
            <Text style={indexStyles.emptyText}>¡Aún no hiciste ningún encargo! 😿</Text>
            ) : (
            commissions.map((commission: CommissionInProgress, index: number) => (
                
                    <CommissionCard
                        title={commission.name}
                        image={`data:image/jpeg;base64,${commission.image}`}
                        artistUsername={commission.artistUsername}
                        totalSteps={commission.totalSteps}
                        currentStep={commission.currentStep}
                        id={commission.id}
                    />
            ))
            )}
        </View>
    </ScrollView>
  );
};
//router.push({ pathname: path, params: { commissionId: comm.id } });