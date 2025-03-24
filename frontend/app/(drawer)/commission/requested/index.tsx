import React, { useContext, useEffect, useState } from "react";
import { View, ScrollView, Text, ActivityIndicator, StyleSheet } from "react-native";
import { CommissionCard } from "@/src/components/requestedCommissions/CommissionCard";
import { getClientCommissions } from "@/src/services/commisionApi";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import LoadingScreen from "@/src/components/LoadingScreen";
import { indexStyles } from "@/src/styles/RequestedCommissions.styles";

type ClientCommission = {
    name: string;
    image: string;
    artistUsername: string;
    totalSteps: number;
    currentStep: number;
  };  

export default function ClientCommissionsScreen() {
  const [commissions, setCommissions] = useState<ClientCommission[]>([]);
  const [loading, setLoading] = useState(true);
  const { loggedInUser } = useContext(AuthenticationContext);

  useEffect(() => {
    getClientCommissions(loggedInUser.token)
      .then(setCommissions)
      .catch((err:string) => {
        console.error("Failed to fetch commissions", err);
        // TODO: add toast here!
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <ProtectedRoute allowedRoles={['CLIENT']}>
        <ScrollView contentContainerStyle={indexStyles.container}>
            <View style={indexStyles.cardGrid}>
                {commissions.length === 0 ? (
                    <Text style={indexStyles.emptyText}>¡Aún no hiciste ningún encargo! 😿</Text>
                ) : (
                    commissions.map((commission, index) => (
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
    </ProtectedRoute>
  );
};
