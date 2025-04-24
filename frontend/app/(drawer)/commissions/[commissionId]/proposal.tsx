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
import WIPPlaceholder from "@/src/components/WorkInProgress";
import colors from "@/src/constants/colors";
import { StatusCommission } from "@/src/constants/CommissionTypes";
import LoadingScreen from "@/src/components/LoadingScreen";
import { BASE_URL } from "@/src/constants/api";
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

  // Estado para manejar los valores de los nuevos campos de pago
  const [initialPaymentArrangement, setInitialPaymentArrangement] = useState<string | null>(null);
  const [paymentArrangement, setPaymentArrangement] = useState(initialPaymentArrangement || "INITIAL");
  const [initialtotalPayments, setInitialTotalPayments] = useState("4");
  const [totalPayments, setTotalPayments] = useState("4");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // Estado para manejar la visibilidad del dropdown
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [editing, setEditing] = useState(false); // al principio no está editando
  const [isPaymentTypeSaved, setIsPaymentTypeSaved] = useState(false);
  const [paymentType, setPaymentType] = useState<string>('');

  const handleAccept = async () => {
    if (!commission) return;
    try {
      const numPayments = parseInt(totalPayments, 10);
      if((numPayments <= 2 || numPayments > 10) && paymentArrangement === "MODERATOR") {
        alert("El número de pagos debe ser mayor que 2 y menos o igual a 10");
      }else{
      await toPay(commission.id, loggedInUser.token);
      await updatePayment(commission.id, paymentArrangement, numPayments, loggedInUser.token)
      await refreshCommission();
      alert("Comisión aceptada");
    } 
  }catch (err: any) {
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

  const handleSavePrice = async () => {
    if (!commission || !loggedInUser.token) return;
    setSaving(true);
    try {
      const parsedPrice = parseFloat(newPrice);
      const price = isClient
        ? parseFloat((parsedPrice / 1.06).toFixed(2))
        : parsedPrice;

      await priceValidationSchema.validate({ newPrice });

      const updatedCommission = { ...commission, price };
      await waiting(commission.id, updatedCommission, loggedInUser.token);

      setCommission(updatedCommission);
      await refreshCommission();
      setShowEditCard(false);
      alert("Precio actualizado con éxito");
    } catch (error: any) {
      const message =
        error instanceof yup.ValidationError
          ? error.message
          : error.message || "Hubo un error al actualizar el precio";

      setErrorMessage(message);
      console.error("Error al actualizar el precio:", error);
    } finally {
      setSaving(false);
    }
  };
  const handleSavePaymentDetails = async () => {
    if (!commission || !loggedInUser.token) return;
    try {
      const numPayments = parseInt(totalPayments, 10);
      if ((numPayments <= 2 || numPayments > 10) && paymentArrangement === "MODERATOR") {
        alert("El número de pagos debe ser mayor que 2 y menos o igual a 10");
      } else {
        await updatePayment(commission.id, paymentArrangement, numPayments, loggedInUser.token);
        setIsPaymentTypeSaved(true);
        await refreshCommission();
        alert("Detalles de pago actualizados correctamente"); // Alerta de éxito
        setIsButtonDisabled(true);
        setEditing(false);
      }
    } catch (error: any) {
      setErrorMessage(error.message);
      console.error("Error al actualizar los detalles de pago:", error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const commission = await getCommissionById(Number(commissionId));
        setInitialPaymentArrangement(commission.paymentArrangement);
        setInitialTotalPayments(commission.totalPayments);
      } catch (err) {
        console.error("Error al obtener el tipo de pago inicial:", err);
      }
    }, 2000); // cada 2 segundos
  
    return () => clearInterval(intervalId); // limpiar al desmontar
  }, [commissionId]);

  useEffect(() => {
    if (commission) {
      const basePrice = commission.price;
      const displayedPrice = isClient
        ? (basePrice * 1.06).toFixed(2)
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

  if (!commission) return <WIPPlaceholder />;
  if (!loggedInUser) return <LoadingScreen />;

  const isArtist = commission.artistUsername === loggedInUser.username;
  const isClient = commission.clientUsername === loggedInUser.username;
  const isArtistTurn = [
    StatusCommission.WAITING_ARTIST,
    StatusCommission.REQUESTED,
  ].includes(commission.status);
  const isClientTurn = [
    StatusCommission.WAITING_CLIENT,
    StatusCommission.NOT_PAID_YET,
  ].includes(commission.status);

  const yourTurn = (isArtist && isArtistTurn) || (isClient && isClientTurn);

  const basePrice = commission.price;
  const displayedPrice = isClient
    ? (basePrice * 1.06).toFixed(2)
    : basePrice.toFixed(2);

  const parsedInput = parseInt(newPrice);
  const canSend =
    !saving &&
    parseInt(newPrice) !== parseInt(displayedPrice);

    const calculateAmountToPayIPA = () => {
      switch (initialPaymentArrangement) {
        case "INITIAL":
          return `Ha seleccionado el método de pago ${initialPaymentArrangement}. Tendría que realizar 1 pago de ${(parseFloat(newPrice|| "0") * 1.06).toFixed(2)}€. Está usted a la espera de negociaciones`;
        case "FINAL":
          return `Ha seleccionado el método de pago ${initialPaymentArrangement}. Tendría que realizar 1 pago de ${(parseFloat(newPrice|| "0") * 1.06).toFixed(2)}€. Está usted a la espera de negociaciones`;
        case "FIFTYFIFTY":
          return `Ha seleccionado el método de pago ${initialPaymentArrangement}. Tendría que realizar 2 pagos de ${((parseFloat(newPrice|| "0") * 1.06) / 2).toFixed(2)}€ cada uno. Está usted a la espera de negociaciones`;
        case "MODERATOR":
          return `Ha seleccionado el método de pago ${initialPaymentArrangement}. Tendría que realizar ${initialtotalPayments} pagos de ${((parseFloat(newPrice|| "0") * 1.06) / parseInt(totalPayments)).toFixed(2)}€ cada uno. Está usted a la espera de negociaciones`;
        default:
          return "";
      }
    };
    const calculateAmountToPayPA = () => {
      switch (paymentArrangement) {
        case "INITIAL":
          return `Ha seleccionado el método de pago ${paymentArrangement}. Tendría que realizar 1 pago de ${(parseFloat(newPrice|| "0") * 1.06).toFixed(2)}€.`;
        case "FINAL":
          return `Ha seleccionado el método de pago ${paymentArrangement}. Tendría que realizar 1 pago de ${(parseFloat(newPrice|| "0") * 1.06).toFixed(2)}€. `;
        case "FIFTYFIFTY":
          return `Ha seleccionado el método de pago ${paymentArrangement}. Tendría que realizar 2 pagos de ${((parseFloat(newPrice|| "0") * 1.06) / 2).toFixed(2)}€ cada uno.`;
        case "MODERATOR":
          return `Ha seleccionado el método de pago ${paymentArrangement}. Tendría que realizar ${totalPayments} pagos de ${((parseFloat(newPrice|| "0") * 1.06) / parseInt(totalPayments)).toFixed(2)}€ cada uno.`;
        default:
          return "";
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
                    : (parseFloat(newPrice || "0") * 1.06).toFixed(2)}{" "}
                  €
                </Text>
                {yourTurn && 
                  !(commission.status === StatusCommission.NOT_PAID_YET) && (
                    <IconButton
                    onPress={() => {
                      if (isPaymentTypeSaved) {
                        setShowEditCard(true);
                      } else {
                        alert("No puedes editar el precio hasta que no guardes los cambios del tipo de pago");
                      }
                    }}
                      icon="pencil"
                      iconColor={colors.brandPrimary}
                    />
                  )}
              </View>
              <Text
                style={{
                  color: colors.contentStrong,
                  fontStyle: "italic",
                  marginBottom:10,
                }}
              >
                ¡Precio total con tarifa incluida!
              </Text>

  <View style={[styles.card, { alignItems: "center" }]}>
  <Text style={styles.label}>Selecciona el tipo de pago:</Text>
  <Text style={{ color: 'gray', marginTop: 10, marginBottom: 10 }}>
    Recuerda que una vez que guardes los cambios, no podrás volver a cambiar el número de pagos
  </Text>

  {/* Solo permite seleccionar si es su turno */}
  {yourTurn && (<Pressable
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

  {isDropdownVisible && yourTurn && (
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

  {paymentArrangement === "INITIAL" && !isButtonDisabled &&(
    <Text style={styles.description}>Inicial: Se realiza un solo pago al principio</Text>
  )}
  {paymentArrangement === "FINAL" && !isButtonDisabled &&(
    <Text style={styles.description}>Final: Se realiza un solo pago al final</Text>
  )}
  {paymentArrangement === "FIFTYFIFTY" && !isButtonDisabled &&(
    <Text style={styles.description}>50/50: Se realizan dos pagos, uno al principio y otro al final</Text>
  )}
  {paymentArrangement === "MODERATOR" && !isButtonDisabled &&(
    <Text style={styles.description}>
      Moderador: Se realiza el número de pagos que escribas (Mínimo 2 - Máximo 10)
    </Text>
  )}

{initialPaymentArrangement === "INITIAL" && isButtonDisabled &&(
    <Text style={styles.description}>Inicial: Se realiza un solo pago al principio</Text>
  )}
  {initialPaymentArrangement === "FINAL" && isButtonDisabled &&(
    <Text style={styles.description}>Final: Se realiza un solo pago al final</Text>
  )}
  {initialPaymentArrangement === "FIFTYFIFTY" && isButtonDisabled &&(
    <Text style={styles.description}>50/50: Se realizan dos pagos, uno al principio y otro al final</Text>
  )}
  {initialPaymentArrangement === "MODERATOR" && isButtonDisabled &&(
    <Text style={styles.description}>
      Moderador: Se realiza el número de pagos que escribas (Mínimo 2 - Máximo 10)
    </Text>
  )}

  {/* Campo adicional solo si está permitido */}
  {paymentArrangement === "MODERATOR" && yourTurn && (
    <TextInput
      value={totalPayments}
      onChangeText={setTotalPayments}
      mode="outlined"
      keyboardType="numeric"
      placeholder="Número de pagos"
      outlineColor={colors.brandPrimary}
      activeOutlineColor={colors.brandPrimary}
      returnKeyType="done"
      style={{
        backgroundColor: "transparent",
        padding: 10,
        borderWidth: 1,
        borderColor: colors.brandPrimary,
        borderRadius: 5,
        marginBottom: 15,
        color: 'black',
      }}
      theme={{
        colors: {
          text: 'black',
          placeholder: 'black',
          primary: colors.brandPrimary,
        },
      }}
      underlineColor="transparent"
    />
  )}

  {/* Botón de guardar controlado por turnos */}
  {yourTurn && !isButtonDisabled&&(
    <Button onPress={handleSavePaymentDetails} buttonColor={colors.brandPrimary} textColor="white">
      Guardar cambios de pago
    </Button>
  )}
  {yourTurn && isButtonDisabled && (
    <Text style={{ color: 'gray', marginTop: 10 }}>Los cambios han sido guardados, esperando respuesta de negociación</Text>
  )}

  {!isButtonDisabled && (<Text style={styles.description}>
    {calculateAmountToPayPA()}
  </Text>)}

  {isButtonDisabled && (<Text style={styles.description}>
    {calculateAmountToPayIPA()}
  </Text>)}
</View>
              {yourTurn && (
                <View style={{ marginTop: 10 }}>
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
                  {(parseFloat(newPrice || "0") * 1.06).toFixed(2)}€
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
