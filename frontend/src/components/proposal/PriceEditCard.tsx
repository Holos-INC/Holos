import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, IconButton, TextInput } from "react-native-paper";
import colors from "@/src/constants/colors";
import {
  CommissionDTO,
  PaymentArrangement,
  StatusCommission,
} from "@/src/constants/CommissionTypes";
import { PayButton } from "./PayButton";
import { useRouter } from "expo-router";
import { getPaymentLabel } from "@/src/utils/paymentArrangementUtils";
import { Picker } from "@react-native-picker/picker";
import PaymentInfoDialog from "./PaymentInfoDialog";
import { getEtapasBreakdown, getNetPrice } from "@/src/utils/priceUtils";

interface Props {
  activeCard: boolean;
  setActiveCard: (val: boolean) => void;
  newPrice: string;
  setNewPrice: (val: string) => void;
  handleSaveChanges: () => void;
  paymentArrangement: PaymentArrangement;
  setPaymentArrangement: (val: PaymentArrangement) => void;
  errorMessage: string | null;
  isClient: boolean;
  yourTurn: boolean;
  commission: CommissionDTO;
  handleAccept: () => void;
  handleReject: () => void;
  stages: number;
}

export default function PriceEditCard({
  activeCard,
  setActiveCard,
  newPrice,
  setNewPrice,
  handleSaveChanges,
  paymentArrangement,
  setPaymentArrangement,
  errorMessage,
  isClient,
  yourTurn,
  commission,
  handleAccept,
  handleReject,
  stages,
}: Props) {
  const router = useRouter();

  const displayed = parseFloat(newPrice || "0").toFixed(2);
  const [visible, setVisible] = useState(false);

  if (activeCard) {
    return (
      <View style={[styles.card]}>
        <IconButton
          icon="arrow-left"
          iconColor={colors.contentStrong}
          onPress={() => setActiveCard(false)}
          style={styles.leftButton}
        />

        <Text style={styles.label}>¿Cambiar propuesta?</Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Text style={[styles.label, { color: colors.contentStrong }]}>
            Precio:
          </Text>
          <TextInput
            value={newPrice}
            onChangeText={setNewPrice}
            keyboardType="numeric"
            style={{
              height: 30,
              backgroundColor: "transparent",
            }}
          />
          <Text style={{ color: colors.contentStrong }}>€</Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={[
              styles.label,
              { color: colors.contentStrong, marginInlineEnd: 10 },
            ]}
          >
            Forma de pago:
          </Text>
          <Picker
            selectedValue={paymentArrangement}
            onValueChange={(itemValue) => setPaymentArrangement(itemValue)}
            style={{
              borderColor: colors.contentStrong,
              borderRadius: 12,
              paddingBlock: 12,
              paddingHorizontal: 12,
              color: colors.contentStrong,
            }}
            selectionColor={colors.brandPrimary}
          >
            {Object.values(PaymentArrangement).map((arrangement) => (
              <Picker.Item
                key={arrangement}
                label={getPaymentLabel(arrangement)}
                value={arrangement}
              />
            ))}
          </Picker>
          <IconButton
            onPress={() => setVisible(true)}
            icon="information-outline"
            iconColor={colors.brandPrimary}
            size={18}
          />
        </View>
        <Button
          onPress={handleSaveChanges}
          buttonColor={colors.brandPrimary}
          textColor="white"
        >
          Guardar
        </Button>
        <PaymentInfoDialog
          visible={visible}
          onClose={() => setVisible(false)}
        />
        {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.card}>
      {yourTurn && commission.status !== StatusCommission.NOT_PAID_YET && (
        <IconButton
          onPress={() => setActiveCard(true)}
          icon="pencil"
          iconColor={colors.brandPrimary}
          style={styles.editButton}
        />
      )}
      <Text style={styles.total}>{displayed} €</Text>
      <Text
        style={{
          color: colors.contentStrong,
          fontStyle: "italic",
        }}
      >
        ¡Precio total con tarifa incluida!
      </Text>
      <Text style={styles.label}>
        {getPaymentLabel(commission.paymentArrangement)}
        <IconButton
          onPress={() => setVisible(true)}
          icon="information-outline"
          iconColor={colors.brandPrimary}
          size={18}
          style={{ margin: 0 }}
        />
      </Text>

      <Text style={styles.description}>
        {getEtapasBreakdown(
          paymentArrangement,
          parseFloat(newPrice || "0"),
          stages
        )}
      </Text>

      {yourTurn && (
        <View>
          {commission.status === StatusCommission.NOT_PAID_YET ? (
            <PayButton
              onPress={() =>
                router.push(`/commissions/${commission.id}/checkout`)
              }
            />
          ) : (
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Button
                onPress={handleAccept}
                buttonColor={colors.contentStrong}
                textColor="white"
              >
                Aceptar
              </Button>
              <Button
                onPress={handleReject}
                buttonColor={colors.brandPrimary}
                textColor="white"
              >
                Rechazar
              </Button>
            </View>
          )}
        </View>
      )}
      <PaymentInfoDialog visible={visible} onClose={() => setVisible(false)} />
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    width: "100%",
    height: 250,
    borderRadius: 20,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    shadowColor: colors.brandPrimary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.brandPrimary,
  },
  info: {
    color: colors.contentStrong,
    paddingBottom: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  total: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.contentStrong,
  },
  error: {
    color: colors.brandPrimary,
    marginTop: 15,
  },
  description: {
    color: colors.contentStrong,
    textAlign: "center",
  },
  friendlyNote: {
    fontSize: 14,
    color: colors.contentStrong,
    fontStyle: "italic",
  },
  editButton: {
    position: "absolute",
    top: 6,
    right: 6,
    zIndex: 10,
  },
  leftButton: {
    position: "absolute",
    top: 6,
    left: 6,
    zIndex: 10,
  },
});
