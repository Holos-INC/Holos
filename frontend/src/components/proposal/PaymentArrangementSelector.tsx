import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { PaymentArrangement } from "@/src/constants/CommissionTypes";
import colors from "@/src/constants/colors";

interface Props {
  value: PaymentArrangement | null;
  onSelect: (val: PaymentArrangement) => void;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  disabled?: boolean;
  kanbanCount?: number;
  isYourTurn?: boolean;
  initialValue?: PaymentArrangement | null;
}

export default function PaymentArrangementSelector({
  value,
  onSelect,
  isOpen,
  setIsOpen,
  disabled = false,
  kanbanCount,
  isYourTurn = false,
  initialValue,
}: Props) {
  const friendlyDescriptions: Record<PaymentArrangement, string> = {
    INITIAL:
      "🌕 Se realiza un solo pago al principio. Ideal si ya confías en el artista.",
    FINAL:
      "🌑 Se paga todo al final, cuando ya esté terminado. Requiere mucha confianza por parte del artista.",
    FIFTYFIFTY:
      "🌓 Dos pagos: uno al comenzar y otro al finalizar. Ni pa' ti ni pa' mi.",
    MODERATOR: `🌟 Un pago por cada etapa del proceso (en este caso, ${
      kanbanCount ?? "?"
    } etapas).`,
  };

  const label = (val: PaymentArrangement) =>
    ({
      INITIAL: "Pago Inicial",
      FINAL: "Pago Final",
      FIFTYFIFTY: "50/50",
      MODERATOR: "Moderador",
    }[val]);

  return (
    <View>
      {initialValue && (
        <Text style={styles.note}>
          Forma de pago propuesta:{" "}
          <Text style={styles.bold}>{label(initialValue)}</Text>
        </Text>
      )}

      <Pressable
        style={[styles.button, disabled && styles.disabled]}
        onPress={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <Text style={styles.buttonText}>
          {value ? label(value) : "Selecciona un método"}
        </Text>
        <Feather name="chevron-down" size={20} color="white" />
      </Pressable>

      {isOpen && !disabled && (
        <View style={styles.dropdown}>
          {(Object.keys(friendlyDescriptions) as PaymentArrangement[]).map(
            (option) => (
              <Pressable
                key={option}
                onPress={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
              >
                <Text style={styles.option}>{label(option)}</Text>
              </Pressable>
            )
          )}
        </View>
      )}

      {value && <Text style={styles.desc}>{friendlyDescriptions[value]}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.brandPrimary,
    padding: 10,
    borderRadius: 5,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  dropdown: {
    backgroundColor: "white",
    borderRadius: 5,
    borderColor: colors.brandPrimary,
    borderWidth: 1,
    marginBottom: 10,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: colors.brandPrimary,
  },
  desc: {
    fontSize: 14,
    color: colors.contentStrong,
    fontStyle: "italic",
    marginTop: 5,
  },
  note: {
    color: "gray",
    marginTop: 15,
  },
  bold: {
    fontWeight: "bold",
    color: colors.brandPrimary,
  },
  hint: {
    fontSize: 14,
    color: "gray",
    marginTop: 5,
  },
});
