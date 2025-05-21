import React from "react";
import { View, Text } from "react-native";
import colors from "@/src/constants/colors";
import { StyleSheet } from "react-native";
import { getGrossFromNet, getNetPrice } from "@/src/utils/priceUtils";

interface PaymentSummaryCardProps {
  isClient: boolean;
  newPrice: string;
}

export default function PaymentSummaryCard({
  isClient,
  newPrice,
}: PaymentSummaryCardProps) {
  const parsed = parseFloat(newPrice || "0");

  return (
    <View style={[styles.card, { gap: 20 }]}>
      {isClient ? (
        <View>
          <Text style={styles.price}>💰 Tú pagarás: {parsed.toFixed(2)}€</Text>
          <Text style={styles.subtext}>
            ¡Este es el monto que debes abonar!
          </Text>
        </View>
      ) : (
        <>
          <View>
            <Text style={styles.price}>
              🎨 Tú recibes: {parsed.toFixed(2)}€
            </Text>
            <Text style={styles.subtext}>
              ¡Este será el monto que obtendrás una vez completada la comisión!
            </Text>
          </View>
          <View>
            <Text style={styles.price}>
              💰 Cliente paga: {getGrossFromNet(parsed).toFixed(2)}€
            </Text>
            <Text style={styles.subtext}>
              ¡Este es el monto que el cliente abonará!
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingInline: 25,
    paddingBlock: 20,
    backgroundColor: "white",
    width: "100%",
    borderRadius: 20,
    shadowColor: colors.brandPrimary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 6,
  },
  price: {
    color: colors.brandPrimary,
    fontSize: 16,
  },
  subtext: {
    color: colors.contentStrong,
    fontStyle: "italic",
  },
});
