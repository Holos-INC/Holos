import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "@/src/constants/colors";
import UserPanel from "@/src/components/proposal/UserPanel";
import TurnDotsIndicator from "@/src/components/proposal/TurnDotsIndicator";
import { CommissionDTO } from "@/src/constants/CommissionTypes";

interface Props {
  commission: CommissionDTO;
  isClientTurn: boolean;
}

export default function CommissionUserHeaderCard({
  commission,
  isClientTurn,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={{ flexDirection: "row" }}>
        <UserPanel
          username={commission.clientUsername}
          image={commission.imageProfileC}
        />
        <UserPanel
          username={commission.artistUsername}
          image={commission.imageProfileA}
        />
      </View>
      <View style={{ alignItems: "center", flex: 1, marginTop: 5 }}>
        <TurnDotsIndicator isClientTurn={isClientTurn} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 25,
    backgroundColor: "white",
    width: "100%",
    height: 150,
    borderRadius: 20,
    shadowColor: colors.brandPrimary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 6,
  },
});
