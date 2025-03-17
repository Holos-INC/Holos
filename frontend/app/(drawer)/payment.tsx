// src/screens/PaymentScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  TouchableOpacity
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootDrawerParamList } from '@/app/_layout';
import { DrawerNavigationProp } from "@react-navigation/drawer";
import ProtectedRoute from '@/src/components/ProtectedRoute';



type PaymentScreenRouteProp = RouteProp<RootDrawerParamList, 'Payment'>;
type PaymentScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList, "Payment">;
export default function PaymentScreen() {
  // Obtenemos los parámetros (price y workId) de la ruta
  const route = useRoute<PaymentScreenRouteProp>();
  const { price, workId } = route.params;
  const navigation = useNavigation<PaymentScreenNavigationProp>();
  

  // Estados para simular campos de tarjeta
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiration, setExpiration] = useState('');
  const [cvv, setCvv] = useState('');

  const handlePayment = () => {
    // Aquí podrías validar datos o hacer la lógica real de pago
    // Por ahora, simulamos que el pago se ha realizado
    Alert.alert(
      'Pago realizado',
      `Has pagado ${price} € por la obra #${workId}. ¡Gracias por tu compra!`
    );
    
  };
  const handleBackToHome = () => {
    navigation.navigate("Inicio");
  };

  return (
    <ProtectedRoute allowedRoles={["CLIENT"]}>
      <View style={styles.container}>
        <Text style={styles.title}>Pantalla de Pago</Text>
        <Text style={styles.subtitle}>Obra ID: {workId}</Text>
        <Text style={styles.subtitle}>Precio: {price} €</Text>

        <TextInput
          style={styles.input}
          placeholder="Número de Tarjeta"
          keyboardType="numeric"
          value={cardNumber}
          onChangeText={setCardNumber}
        />

        <TextInput
          style={styles.input}
          placeholder="Titular de la Tarjeta"
          value={cardHolder}
          onChangeText={setCardHolder}
        />

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.rowItem]}
            placeholder="MM/AA"
            value={expiration}
            onChangeText={setExpiration}
          />
          <TextInput
            style={[styles.input, styles.rowItem]}
            placeholder="CVV"
            keyboardType="numeric"
            secureTextEntry
            value={cvv}
            onChangeText={setCvv}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Pagar" onPress={handlePayment} />
        </View>
        <TouchableOpacity style={styles.backButton} onPress={handleBackToHome}>
          <Text style={styles.backButtonText}>Volver al Inicio</Text>
        </TouchableOpacity>
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E5F5',
    padding: 20,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute', 
    top: 20,         
    left: 20,          
    backgroundColor: "#173F8A",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  backButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4A148C', 
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#6A1B9A',
    marginBottom: 8,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CE93D8', // Borde pastel
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowItem: {
    width: '48%',
  },
  buttonContainer: {
    marginTop: 20,
    alignSelf: 'center',
    width: '50%',
  },
});