import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  useWindowDimensions
} from "react-native";
import { useContext, useEffect, useState } from "react";
import { Button, IconButton, TextInput } from "react-native-paper";
import { useCommissionDetails } from "@/src/hooks/useCommissionDetails";
import { reject, toPay, waiting, updatePayment, getCommissionById } from "@/src/services/commisionApi";
import { priceValidationSchema } from "@/src/utils/priceValidation";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import PaymentDetails from "@/src/components/checkout/PaymentDetails";
import colors from "@/src/constants/colors";
import { PaymentArrangement, StatusCommission } from "@/src/constants/CommissionTypes";
import LoadingScreen from "@/src/components/LoadingScreen";
import { API_URL } from "@/src/constants/api";
import { getUser } from "@/src/services/userApi";
import UserPanel from "@/src/components/proposal/UserPanel";
import TurnDotsIndicator from "@/src/components/proposal/TurnDotsIndicator";
import { PayButton } from "@/src/components/proposal/PayButton";
import { Feather } from '@expo/vector-icons'; // Usamos el paquete de iconos Feather
import * as yup from "yup";

export default function CommissionDetailsScreen() {
  const { commissionId } = useLocalSearchParams();
  const { loggedInUser } = useContext(AuthenticationContext);
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isTwoColumn = width >= 768;
  const {
    commission,
    setCommission,
    loading,
    errorMessage,
    setErrorMessage,
    refreshCommission,
  } = useCommissionDetails(commissionId);

  const navigation = useNavigation();
  const [newPrice, setNewPrice] = useState("");
  const [showEditCard, setShowEditCard] = useState(false);
  const [saving, setSaving] = useState(false);
  const [initialPrice, setInitialPrice] = useState(newPrice);
  const [initialPaymentArrangement, setInitialPaymentArrangement] = useState<string | null>(null);
  const [paymentArrangement, setPaymentArrangement] = useState<string | null>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // Estado para manejar la visibilidad del dropdown
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [editing, setEditing] = useState(false); // al principio no está editando
  const [isPaymentTypeSaved, setIsPaymentTypeSaved] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false); // Estado para manejar si se ha aceptado la comision
  const [kanbanColumnsCount, setKanbanColumnsCount] = useState(0);

  const handleAccept = async () => {
    if (!commission) return;
    try {
      await toPay(commission.id, loggedInUser.token);
      await refreshCommission();
      setIsDropdownVisible(false); // Ocultar el dropdown al aceptar
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
      router.push("/commissions");
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  const handleSavePrice = async () => {
    if (!commission || !loggedInUser.token) return;
    setSaving(true);
    try {
      const parsedPrice = parseFloat(newPrice);
      const price = isClient
        ? parseFloat((parsedPrice).toFixed(2))
        : parsedPrice;

      await priceValidationSchema.validate({ newPrice });

      const updatedCommission = { ...commission, price };
      setCommission(updatedCommission);
    } catch (error: any) {
      const message =
        error instanceof yup.ValidationError
          ? error.message
          : error.message || "Hubo un error al actualizar el precio";

      setErrorMessage(message);
      console.error("Error al actualizar el precio:", error);
    }
  };

  const handleSaveChanges = async () => {
    if (!commission || !loggedInUser.token) return;
    setSaving(true);
    try {
      const parsedPrice = parseFloat(newPrice);
      const price = isClient
        ? parseFloat((parsedPrice).toFixed(2))
        : parsedPrice;

      await priceValidationSchema.validate({ newPrice });
      const updatedCommission = {
        ...commission,
        price,
        paymentArrangement: paymentArrangement as PaymentArrangement,
      };

      await waiting(commission.id, updatedCommission, loggedInUser.token);
      await refreshCommission();
      setShowEditCard(false);
      alert("Precio y forma de pago actualizados con éxito");
    } catch (error: any) {
      const message =
        error instanceof yup.ValidationError
          ? error.message
          : error.message || "Hubo un error al confirmar los cambios";

      setErrorMessage(message);
      console.error("Error al confirmar los cambios:", error);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const commission = await getCommissionById(Number(commissionId));
        setInitialPaymentArrangement(commission.paymentArrangement);
        setInitialPrice(commission.price.toString());
      } catch (err) {
        console.error("Error al obtener el tipo de pago inicial:", err);
      }
    }, 2000); // cada 2 segundos

    return () => clearInterval(intervalId); // limpiar al desmontar
  }, [commissionId]);

  useEffect(() => {
    if (commission && commission.paymentArrangement) {
      setPaymentArrangement(commission.paymentArrangement);
    }
  }, [commission?.paymentArrangement]);

  useEffect(() => {
    if (commission) {
      const basePrice = commission.price;
      const displayedPrice = isClient
        ? (basePrice).toFixed(2)
        : basePrice.toFixed(2);

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
    if (commission?.artistUsername) {
      fetch(`${API_URL}/status-kanban-order/count/${commission.artistUsername}`, {
        headers: {
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      })
        .then(response => {
          if (!response.ok) {
            return response.json().then(error => {
              throw new Error(error.message);
            });
          }
          return response.json();
        })
        .then(data => {
          setKanbanColumnsCount(data);
        })
        .catch(error => {
          console.error("Error fetching data: ", error);
          setErrorMessage(error.message);
        });

    }
  }, [commission?.artistUsername]);

  if (!commission || !loggedInUser) return <LoadingScreen />;

  const isArtist = commission.artistUsername === loggedInUser.username;
  const isClient = commission.clientUsername === loggedInUser.username;
  const isArtistTurn = [
    StatusCommission.WAITING_ARTIST,
    StatusCommission.REQUESTED,
  ].includes(commission.status);
  const isClientTurn = [
    StatusCommission.WAITING_CLIENT,
  ].includes(commission.status);

  const yourTurn = (isArtist && isArtistTurn) || (isClient && isClientTurn);

  const basePrice = commission.price;
  const displayedPrice = isClient
    ? (basePrice).toFixed(2)
    : basePrice.toFixed(2);

  const parsedInput = parseInt(newPrice);
  const canSend =
    !saving &&
    parseInt(newPrice) !== parseInt(displayedPrice);

  const calculateAmountToPayIPArtist = () => {
    const price = parseFloat(newPrice || "0");

    switch (paymentArrangement) {
      case "INITIAL":
      case "FINAL":
        return (
          <Text>
            Con el método de pago {paymentArrangement} tendría que realizar 1 pago de {price.toFixed(2)}€ cada uno.
            Acepta si le parece bien o cámbielo para negociar.
          </Text>
        );
      case "FIFTYFIFTY":
        return (
          <Text>
            Con el método de pago {paymentArrangement} tendría que realizar 2 pagos de {(price / 2).toFixed(2)}€ cada uno. Acepta si le parece bien o cámbielo para negociar.
          </Text>
        );
      case "MODERATOR":
        return (
          <Text>
            Con el método de pago {paymentArrangement} tendría que realizar {kanbanColumnsCount} pagos de {(price / kanbanColumnsCount).toFixed(2)}€ cada uno.
            Acepta si le parece bien o cámbielo para negociar.
          </Text>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        flexDirection: isTwoColumn ? "row" : "column",
        flexGrow: 1,
        gap: isTwoColumn ? 0 : 500,
      }}
    >
      <Button
        icon="arrow-left"
        onPress={() => router.push(`/commissions`)}
        style={{
          position: "absolute",
          top: 24,
          left: 16,
          zIndex: 10,
          backgroundColor: "transparent",
        }}
        labelStyle={{ color: "grey" }}
      >
        ATRÁS
      </Button>
      <View
        style={{
          flexDirection: isTwoColumn ? "row" : "column",
          flexGrow: 1,
          paddingVertical: isTwoColumn ? 0 : 50,
        }}
      >
        <View style={styles.sides}>
          <PaymentDetails commission={commission} />
        </View>
        <View style={styles.sides}>
          <View style={[styles.card]}>
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
            <View style={{ alignItems: "center", flex: 1, marginTop: 15 }}>
              <TurnDotsIndicator isClientTurn={isClientTurn} />
            </View>
          </View>

          {showEditCard ? (
            <View style={[styles.card, { alignItems: "center" }]}>
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flex: 1 }}>
                  <IconButton
                    icon="arrow-left"
                    iconColor={colors.contentStrong}
                    onPress={() => setShowEditCard(false)}
                  />
                </View>
                <View style={{ flex: 1, alignItems: "center" }}>
                  <Text style={styles.label}>¿Cambiar precio?</Text>
                </View>
                <View style={{ flex: 1 }} />
              </View>

              <Text style={{ color: colors.contentStrong, paddingBottom: 10 }}>
                ¡Puedes proponer otro si crees que el actual no está bien!
              </Text>
              <TextInput
                value={newPrice}
                onChangeText={setNewPrice}
                mode="outlined"
                keyboardType="numeric"
                placeholder="€"
                outlineColor={colors.brandPrimary}
                activeOutlineColor={colors.brandPrimary}
                returnKeyType="done"
                onSubmitEditing={handleSavePrice}
                theme={{ roundness: 999 }}
                style={{ backgroundColor: "transparent" }}
                right={
                  <TextInput.Icon
                    icon="send"
                    onPress={canSend ? handleSavePrice : undefined}
                    color={canSend ? colors.brandPrimary : colors.surfaceBase}
                    disabled={!canSend}
                  />
                }
              />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : (
            <View style={[styles.card, { alignItems: "center" }]}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    color: colors.contentStrong,
                  }}
                >
                  {isClient
                    ? parseFloat(newPrice || "0").toFixed(2)
                    : (parseFloat(newPrice || "0")).toFixed(2)}{" "}
                  €
                </Text>
                {yourTurn && (
                  <IconButton
                    onPress={() => setShowEditCard(true)}
                    icon="pencil"
                    iconColor={colors.brandPrimary}
                  />
                )}
              </View>
              <Text
                style={{
                  color: colors.contentStrong,
                  fontStyle: "italic",
                  marginBottom: 10,
                }}
              >
                ¡Precio total con tarifa incluida!
              </Text>

              <View style={[styles.card, { alignItems: "center" }]}>
                {(isArtistTurn || isClientTurn) &&
                  yourTurn && <Text style={styles.label}>Selecciona el tipo de pago:</Text>}

                <Text style={{ color: 'gray', marginTop: 20, marginBottom: 10 }}>
                  Método de pago establecido hasta ahora: {""} <Text style={{ color: 'gray', marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>{initialPaymentArrangement} </Text>.
                </Text>

                {(isArtistTurn || isClientTurn) && yourTurn &&
                  <Text style={{ color: 'gray', marginTop: 10, marginBottom: 10 }}>
                    Para aceptar la comisión no modifique el precio ni el método de pago establecido. Si lo hace, podrá modificar la comisión y seguir negociando.
                  </Text>}

                {/* Solo permite seleccionar si es su turno */}
                {yourTurn &&
                  (isArtistTurn || isClientTurn) && (<Pressable
                    style={[styles.button,]}
                    onPress={() => !isButtonDisabled && setIsDropdownVisible(!isDropdownVisible)}
                    disabled={!yourTurn}
                  >
                    <Text style={styles.buttonText}>
                      {paymentArrangement === "INITIAL" && "Pago Inicial"}
                      {paymentArrangement === "FINAL" && "Pago Final"}
                      {paymentArrangement === "FIFTYFIFTY" && "50/50"}
                      {paymentArrangement === "MODERATOR" && "Moderador"}
                    </Text>
                    <Feather name="chevron-down" size={20} color="white" />
                  </Pressable>)}

                {isDropdownVisible && yourTurn && !hasAccepted && (
                  <View style={styles.dropdownOptions}>
                    <Pressable onPress={() => { setPaymentArrangement("INITIAL"); setIsDropdownVisible(false); }}>
                      <Text style={styles.option}>Pago Inicial</Text>
                    </Pressable>
                    <Pressable onPress={() => { setPaymentArrangement("FINAL"); setIsDropdownVisible(false); }}>
                      <Text style={styles.option}>Pago Final</Text>
                    </Pressable>
                    <Pressable onPress={() => { setPaymentArrangement("FIFTYFIFTY"); setIsDropdownVisible(false); }}>
                      <Text style={styles.option}>50/50</Text>
                    </Pressable>
                    <Pressable onPress={() => { setPaymentArrangement("MODERATOR"); setIsDropdownVisible(false); }}>
                      <Text style={styles.option}>Moderador</Text>
                    </Pressable>
                  </View>
                )}

                {/* Descripciones */}

                {paymentArrangement === "INITIAL" && !isButtonDisabled && (
                  <Text style={styles.description}>Inicial: Se realiza un solo pago al principio</Text>
                )}
                {paymentArrangement === "FINAL" && !isButtonDisabled && (
                  <Text style={styles.description}>Final: Se realiza un solo pago al final</Text>
                )}
                {paymentArrangement === "FIFTYFIFTY" && !isButtonDisabled && (
                  <Text style={styles.description}>50/50: Se realizan dos pagos, uno al principio y otro al final</Text>
                )}
                {paymentArrangement === "MODERATOR" && !isButtonDisabled && (
                  <Text style={styles.description}>
                    Moderador: Se realiza el un pago por cada etapa de trabajo del artista
                  </Text>
                )}

                {paymentArrangement === "INITIAL" && isButtonDisabled && (
                  <Text style={styles.description}>Inicial: Se realiza un solo pago al principio</Text>
                )}
                {paymentArrangement === "FINAL" && isButtonDisabled && (
                  <Text style={styles.description}>Final: Se realiza un solo pago al final</Text>
                )}
                {paymentArrangement === "FIFTYFIFTY" && isButtonDisabled && (
                  <Text style={styles.description}>50/50: Se realizan dos pagos, uno al principio y otro al final</Text>
                )}
                {paymentArrangement === "MODERATOR" && isButtonDisabled && (
                  <Text style={styles.description}>
                    Moderador: Se realiza el número de pagos que escribas (Mínimo 2 - Máximo 10)
                  </Text>
                )}

                {paymentArrangement === "MODERATOR" && yourTurn && !hasAccepted && (
                  <Text
                    style={{
                      backgroundColor: "transparent",
                      padding: 10,
                      borderWidth: 1,
                      borderColor: colors.brandPrimary,
                      borderRadius: 5,
                      marginBottom: 15,
                      color: 'black',
                      textAlign: 'center',
                    }}
                  >
                    Número de etapas: {kanbanColumnsCount}
                  </Text>
                )}

                <Text style={styles.description}>
                  {calculateAmountToPayIPArtist()}
                </Text>
              </View>
              <View style={{ marginTop: 10 }}>
                {isClient && commission.status === StatusCommission.NOT_PAID_YET ? (
                  <PayButton
                    onPress={() =>
                      router.push(`/commissions/${commission.id}/checkout`)
                    }
                  />
                ) : (
                  <View style={{ flexDirection: "row", gap: 10 }}>
                    {paymentArrangement === initialPaymentArrangement && basePrice === parseFloat(initialPrice) && yourTurn && !isButtonDisabled &&
                      (<Button
                        onPress={handleAccept}
                        buttonColor={colors.contentStrong}
                        textColor="white"
                      >
                        Aceptar
                      </Button>)}
                    {yourTurn && (<Button
                      onPress={handleReject}
                      buttonColor={colors.brandPrimary}
                      textColor="white"
                    >
                      Rechazar
                    </Button>)}
                    {yourTurn && (<Button
                      onPress={handleSaveChanges}
                      buttonColor={colors.surfaceBase}
                      textColor={colors.contentStrong}
                    >
                      Guardar cambios
                    </Button>)}
                  </View>
                )}
              </View>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}
          {isClient ? (
            <View style={[styles.card, { gap: 20 }]}>
              <View>
                <Text style={{ color: colors.brandPrimary, fontSize: 16 }}>
                  💰 Tú pagarás: {parseFloat(newPrice || "0").toFixed(2)}€
                </Text>
                <Text
                  style={{ color: colors.contentStrong, fontStyle: "italic" }}
                >
                  ¡Este es el monto que debes abonar!
                </Text>
              </View>
            </View>
          ) : (
            <View style={[styles.card, { gap: 20 }]}>
              <View>
                <Text style={{ color: colors.brandPrimary, fontSize: 16 }}>
                  🎨 Tú recibes: {parseFloat(newPrice || "0").toFixed(2)}€
                </Text>
                <Text
                  style={{ color: colors.contentStrong, fontStyle: "italic" }}
                >
                  ¡Este será el monto que obtendrás una vez completada la
                  comisión!
                </Text>
              </View>
              <View>
                <Text style={{ color: colors.brandPrimary, fontSize: 16 }}>
                  💰 Cliente paga:{" "}
                  {(parseFloat(newPrice || "0")).toFixed(2)}€
                </Text>
                <Text
                  style={{ color: colors.contentStrong, fontStyle: "italic" }}
                >
                  ¡Este es el monto que el cliente abonará!
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: colors.surfaceMuted,
    width: "100%",
  },
  button: {
    backgroundColor: colors.brandPrimary,
    padding: 10,
    borderRadius: 5,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  sides: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    padding: "10%",
    gap: 33,
  },
  dropdownOptions: {
    backgroundColor: 'white',
    borderRadius: 5,
    marginTop: 5,
    padding: 10,
    borderColor: colors.brandPrimary,
    borderWidth: 1,
  },
  option: {
    paddingVertical: 8,
    fontSize: 16,
    color: colors.brandPrimary,
  },
  totalPrice: {
    fontSize: 16,
    color: colors.contentStrong,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.brandPrimary,
  },
  errorText: {
    color: colors.brandPrimary,
    marginTop: 15,
  },
  card: {
    padding: 25,
    backgroundColor: "white",
    width: "100%",
    borderRadius: 20,
    shadowColor: colors.brandPrimary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 6,
  },
  description: {
    fontSize: 14,
    color: colors.contentStrong,
    marginTop: 10,
    fontStyle: "italic",
    marginBottom: 10,
  }
});