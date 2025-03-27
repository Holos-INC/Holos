import { Commission } from '@/src/constants/CommissionTypes';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  commission: Commission;
};

const PaymentDetails = ({ commission }: Props) => {
  return (
    <View style={styles.details}>
      <Text style={styles.label}>Title</Text>
      <Text style={styles.text}>{commission.name}</Text>

      <Text style={styles.label}>Artist</Text>
      <Text style={styles.text}>{commission.artist.baseUser.username}</Text>

      <Text style={styles.label}>Total</Text>
      <Text style={styles.text}>{commission.price}€</Text>
    </View>
  );
};

export default PaymentDetails;

const styles = StyleSheet.create({
  details: { padding: 16 },
  label: { fontWeight: 'bold', color: '#888', marginTop: 12 },
  text: { fontSize: 16, color: '#333' },
});
