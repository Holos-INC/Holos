import { Text } from "react-native";
import { PaymentArrangement } from "../constants/CommissionTypes";

const HOLOS = 0.06;
const STRIPE = 0.015;
const FEE = HOLOS + STRIPE;
const STRIPE_FIXED = 0.25;

export function getNetPrice(gross: number): number {
  return Math.round((gross * (1 - FEE) - STRIPE_FIXED) * 100) / 100;
}

export function getGrossFromNet(net: number): number {
  return Math.round(((net + STRIPE_FIXED) / (1 - FEE)) * 100) / 100;
}

export function getHolosFee(gross: number): number {
  return Math.round(gross * HOLOS * 100) / 100;
}

export function getStripeFee(gross: number): number {
  return Math.round((gross * STRIPE + STRIPE_FIXED) * 100) / 100;
}

export function getEtapasBreakdown(
  paymentArrangement: PaymentArrangement,
  total: number,
  etapas: number
): string {
  const base = Math.floor((total / etapas) * 100) / 100;
  const approx = base.toFixed(2);

  switch (paymentArrangement) {
    case "INITIAL":
    case "FINAL":
      return `Un sólo pago de ${total.toFixed(2)}€`;

    case "FIFTYFIFTY":
      return `Dos pagos de ${(total / 2).toFixed(2)}€ cada uno`;

    case "MODERATOR":
      return `Número de etapas: ${
        etapas + 1
      }\n${etapas} pagos de ${approx}€.\n💡 La primera etapa es organizativa y no se cobra.`;

    default:
      return "";
  }
}

export { HOLOS, STRIPE, FEE, STRIPE_FIXED };
