import {
  useWindowDimensions,
  ScrollView,
  View,
  StyleSheet,
} from "react-native";
import LoadingScreen from "@/src/components/LoadingScreen";
import PaymentDetails from "@/src/components/checkout/PaymentDetails";
import PriceEditCard from "@/src/components/proposal/PriceEditCard";
import PaymentSummaryCard from "@/src/components/proposal/PaymentSummaryCard";
import CommissionUserHeaderCard from "@/src/components/proposal/CommissionUserHeaderCard";
import { useCommissionNegotiation } from "@/src/hooks/useCommissionNegotiation";
import colors from "@/src/constants/colors";

export default function CommissionDetailsScreen() {
  const {
    commission,
    loggedInUser,
    newPrice,
    setNewPrice,
    activeCard,
    setActiveCard,
    handleSaveChanges,
    paymentArrangement,
    setPaymentArrangement,
    handleAccept,
    handleReject,
    errorMessage,
    isClient,
    isClientTurn,
    yourTurn,
    kanbanColumnsCount,
  } = useCommissionNegotiation();

  const { width } = useWindowDimensions();
  const isTwoColumn = width >= 768;

  if (!commission || !loggedInUser) return <LoadingScreen />;

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
      <View
        style={[
          styles.container,
          {
            flexDirection: isTwoColumn ? "row" : "column",
          },
        ]}
      >
        <View
          style={[
            styles.sides,
            {
              flex: isTwoColumn ? 1 : undefined,
              padding: 50,
            },
          ]}
        >
          <PaymentDetails commission={commission} />
        </View>
        <View
          style={[
            styles.sides,
            {
              flex: isTwoColumn ? 1 : undefined,
              padding: 50,
              gap: isTwoColumn ? 0 : 25,
            },
          ]}
        >
          <CommissionUserHeaderCard
            commission={commission}
            isClientTurn={isClientTurn}
          />
          <PriceEditCard
            activeCard={activeCard}
            setActiveCard={setActiveCard}
            newPrice={newPrice}
            setNewPrice={setNewPrice}
            handleSaveChanges={handleSaveChanges}
            paymentArrangement={paymentArrangement}
            setPaymentArrangement={setPaymentArrangement}
            errorMessage={errorMessage}
            isClient={isClient}
            yourTurn={yourTurn}
            commission={commission}
            handleAccept={handleAccept}
            handleReject={handleReject}
            stages={kanbanColumnsCount}
          />
          <PaymentSummaryCard isClient={isClient} newPrice={newPrice} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceMuted,
    flexGrow: 1,
  },
  sides: {
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingHorizontal: "10%",
  },
});
