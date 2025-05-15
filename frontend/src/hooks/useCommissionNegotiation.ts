import { useState, useEffect, useContext } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import * as yup from "yup";
import { useCommissionDetails } from "@/src/hooks/useCommissionDetails";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import { priceValidationSchema } from "@/src/utils/priceValidation";
import { toPay, reject, waiting } from "@/src/services/commisionApi";
import {
  PaymentArrangement,
  StatusCommission,
} from "@/src/constants/CommissionTypes";
import { getGrossFromNet, getNetPrice } from "../utils/priceUtils";
import { fetchKanbanColumnCount } from "../services/kanbanApi";

export function useCommissionNegotiation() {
  const { commissionId } = useLocalSearchParams();
  const { loggedInUser } = useContext(AuthenticationContext);
  const {
    commission,
    setCommission,
    errorMessage,
    setErrorMessage,
    refreshCommission,
  } = useCommissionDetails(commissionId);

  const navigation = useNavigation();
  const [newPrice, setNewPrice] = useState("");
  const [paymentArrangement, setPaymentArrangement] =
    useState<PaymentArrangement>(
      () => commission?.paymentArrangement ?? PaymentArrangement.INITIAL
    );
  const [activeCard, setActiveCard] = useState(false);
  const [kanbanColumnsCount, setKanbanColumnsCount] = useState(0);

  const isArtist = commission?.artistUsername === loggedInUser?.username;
  const isClient = commission?.clientUsername === loggedInUser?.username;

  const isArtistTurn = commission?.status
    ? [StatusCommission.WAITING_ARTIST, StatusCommission.REQUESTED].includes(
        commission.status
      )
    : false;

  const isClientTurn = commission?.status
    ? [StatusCommission.WAITING_CLIENT, StatusCommission.NOT_PAID_YET].includes(
        commission.status
      )
    : false;

  const yourTurn = (isArtist && isArtistTurn) || (isClient && isClientTurn);

  const handleAccept = async () => {
    if (!commission) return;
    try {
      await toPay(commission.id, loggedInUser.token);
      await refreshCommission();
      alert("Comisión aceptada");
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  const handleReject = async () => {
    if (!commission) return;
    try {
      await reject(commission.id, loggedInUser.token);
      await refreshCommission();
      alert("Comisión rechazada");
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  const handleSaveChanges = async () => {
    if (!commission || !loggedInUser?.token) return;

    try {
      const parsedPrice = parseFloat(newPrice);

      const price = isClient ? parsedPrice : getGrossFromNet(parsedPrice);

      await priceValidationSchema.validate({ newPrice });

      const updatedCommission = {
        ...commission,
        price,
        paymentArrangement,
      };

      await waiting(commission.id, updatedCommission, loggedInUser.token);
      await refreshCommission();
      setActiveCard(false);
      alert("¡Cambios guardados con éxito!");
    } catch (error: any) {
      const message =
        error instanceof yup.ValidationError
          ? error.message
          : error.message || "Ocurrió un error al guardar los cambios";
      setErrorMessage(message);
      console.error("Error al guardar cambios:", error);
    }
  };

  useEffect(() => {
    if (commission) {
      const basePrice = commission.price;
      const displayedPrice = isClient
        ? basePrice.toFixed(2)
        : getNetPrice(basePrice).toFixed(2);
      setNewPrice(displayedPrice);
    }
  }, [commission]);

  useEffect(() => {
    navigation.setOptions({
      title: commission?.name
        ? `Negociación obra: ${commission.name}`
        : "Negociación",
    });
  }, [commission?.name, navigation]);

  useEffect(() => {
    if (!commission?.artistUsername) return;

    fetchKanbanColumnCount(commission.artistUsername, loggedInUser.token)
      .then(setKanbanColumnsCount)
      .catch((error) => {
        console.error("Error fetching kanban column count:", error);
        setErrorMessage(error.message);
      });
  }, [commission?.artistUsername]);

  useEffect(() => {
    if (commission?.paymentArrangement) {
      setPaymentArrangement(commission.paymentArrangement);
    }
  }, [commission?.paymentArrangement]);

  return {
    commission,
    loggedInUser,
    newPrice,
    setNewPrice,
    activeCard,
    setActiveCard,
    handleSaveChanges,
    handleAccept,
    handleReject,
    errorMessage,
    isClient,
    isClientTurn,
    yourTurn,
    kanbanColumnsCount,
    paymentArrangement,
    setPaymentArrangement,
  };
}
