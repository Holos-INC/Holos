import React from "react";
import { Text, View } from "react-native";
import { Dialog, Portal, Button } from "react-native-paper";
import { PaymentArrangement } from "@/src/constants/CommissionTypes";
import {
  getPaymentLabel,
  getPlainExplanation,
  getFriendlyExplanation,
} from "@/src/utils/paymentArrangementUtils";
import colors from "@/src/constants/colors";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const allArrangements: PaymentArrangement[] = [
  PaymentArrangement.INITIAL,
  PaymentArrangement.FINAL,
  PaymentArrangement.FIFTYFIFTY,
  PaymentArrangement.MODERATOR,
];

const PaymentInfoDialog: React.FC<Props> = ({ visible, onClose }) => {
  return (
    <Portal>
      <Dialog
        style={{ width: "33%", alignSelf: "center", alignItems: "center" }}
        visible={visible}
        onDismiss={onClose}
      >
        <Dialog.Title
          style={{ color: colors.contentStrong, fontWeight: "bold" }}
        >
          Opciones de Pago
        </Dialog.Title>
        <Dialog.Content
          style={{ flexDirection: "column", alignItems: "center", gap: 20 }}
        >
          {allArrangements.map((arrangement) => (
            <View key={arrangement} style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontWeight: "bold",
                  color: colors.brandPrimary,
                  textAlign: "center",
                }}
              >
                {getPaymentLabel(arrangement)}
              </Text>
              <Text style={{ textAlign: "center" }}>
                {getPlainExplanation(arrangement)}
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  fontStyle: "italic",
                  fontWeight: "100",
                }}
              >
                {getFriendlyExplanation(arrangement)}
              </Text>
            </View>
          ))}
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

export default PaymentInfoDialog;
