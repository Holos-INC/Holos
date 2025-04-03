import PaymentDetails from "@/src/components/checkout/PaymentDetails";
import PaymentForm from "@/src/components/checkout/PaymentForm";
import LoadingScreen from "@/src/components/LoadingScreen";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import WIPPlaceholder from "@/src/components/WorkInProgress";
import { Commission } from "@/src/constants/CommissionTypes";
import { getCommissionById } from "@/src/services/commisionApi";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const public_pk =  "pk_test_51R5yBhPEFPLFpq6fet8cJiv4MeVyAS06kdbP7nU1ct0oV9o237npeBw5c1h2WFNL0XYWHRFCzxMUbSnBMFHfzTld00NqKYPZeG";

export default function Checkout () {
    const { commissionId } = useLocalSearchParams();
    const [commission, setCommission] = useState<Commission|null>(null);
    const stripePromise = loadStripe(public_pk);
    const navigation = useNavigation();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { width } = useWindowDimensions();
    const isTwoColumn = width >= 768;

    useEffect(() => {
      console.log(commissionId)
      if (!commissionId) return;
      const fetchCommission = async () => {
        try {
          const data = await getCommissionById(Number(commissionId));
          setCommission(data);
        } catch (err: any) {
          setError(err.message || "Failed to fetch commission");
        } finally {
          setLoading(false);
        }
      };
  
      fetchCommission();
    }, [commissionId]);

    useEffect(() => {
      navigation.setOptions({ title: '🛍️ Checkout' });
    }, [navigation]);
    
    if (loading) return <LoadingScreen />;
    if (error) return <Text style={{ padding: 24, color: 'red' }}>{error}</Text>;
    if (!commission) return <WIPPlaceholder message="Replace with a true error screen." />;

    return (
      <ProtectedRoute allowedRoles={['CLIENT']}>
        <Elements stripe={stripePromise}>
          <ScrollView contentContainerStyle={styles.scroll}>
            <View style={[styles.container, isTwoColumn && styles.row]}>
              <View style={[styles.column, isTwoColumn && styles.column]}>
                <PaymentForm amount={commission.price} commissionId={commission.id} description={commission.description} />
              </View>
              <View style={[styles.column, isTwoColumn && styles.column]}>
                <PaymentDetails commission={commission} />
              </View>
            </View>
          </ScrollView>
        </Elements>
      </ProtectedRoute>
    )
}

const styles = StyleSheet.create({
  scroll: {
    padding: 16,
    flexGrow:1,
    justifyContent: 'center', 
  },
  container: {
    flexDirection: 'column',
    gap: 16,
    flexShrink: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  column: {
    alignContent:'center',
    justifyContent: 'center',
    flex: 1,
    padding: 24,
    minWidth: 0,
    marginVertical: 50,
  }
});
