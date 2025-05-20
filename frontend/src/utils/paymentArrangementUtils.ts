import { PaymentArrangement } from "@/src/constants/CommissionTypes";

export const getPaymentLabel = (val: PaymentArrangement): string =>
  ({
    INITIAL: "🌕 Pago Inicial",
    FINAL: "🌑 Pago Final",
    FIFTYFIFTY: "🌓 50/50",
    MODERATOR: "🌞 Moderador",
  }[val]);

export const getPlainExplanation = (val: PaymentArrangement): string =>
  ({
    INITIAL: "Un solo pago al principio.",
    FINAL: "Un solo pago al final.",
    FIFTYFIFTY: "Dos pagos: uno al inicio y otro al final.",
    MODERATOR:
      "El pago se hace al inicio, Holos guarda el dinero y lo libera por etapas, según lo que se entregue.",
  }[val]);

export const getFriendlyExplanation = (val: PaymentArrangement): string =>
  ({
    INITIAL: "Ideal si se confía en el artista.",
    FINAL: "¡Requiere mucha confianza por parte del artista!",
    FIFTYFIFTY: "Ni pa' ti ni pa' mi.",
    MODERATOR: `¡Nuestro pago estrella! Entregas por etapas, pago por etapas.`,
  }[val]);
