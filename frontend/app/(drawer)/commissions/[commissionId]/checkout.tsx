import PaymentCard from "@/src/components/checkout/PaymentCard";
import PaymentDetails from "@/src/components/checkout/PaymentDetails";
import PaymentForm from "@/src/components/checkout/PaymentForm";
import LoadingScreen from "@/src/components/LoadingScreen";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import WIPPlaceholder from "@/src/components/WorkInProgress";
import { Commission } from "@/src/constants/CommissionTypes";
import { getCommissionById } from "@/src/services/commisionApi";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function Checkout () {
    const { commissionId } = useLocalSearchParams();
    const [formValues, setFormValues] = useState({ cardNumber: '', cardName: '', exp: '',});
    const [commission, setCommission] = useState<Commission|null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { width } = useWindowDimensions();
    const isThreeColumn = width >= 768;

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
    
    if (loading) return <LoadingScreen />;
    if (error) return <Text style={{ padding: 24, color: 'red' }}>{error}</Text>;
    if (!commission) return <WIPPlaceholder message="Replace with a true error screen." />;

    return (
      <ProtectedRoute allowedRoles={['CLIENT']}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={[styles.container, isThreeColumn && styles.row]}>
            <View style={[styles.column, isThreeColumn && styles.column]}>
              <PaymentCard values={formValues} />
            </View>
            <View style={[styles.column, isThreeColumn && styles.column]}>
              <PaymentForm onChange={setFormValues} price={commission.price} />
            </View>
            <View style={[styles.column, isThreeColumn && styles.column]}>
              <PaymentDetails commission={commission} />
            </View>
          </View>
        </ScrollView>
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
