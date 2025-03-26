import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '@/src/constants/colors';

interface PaymentCardProps {
  values: { cardNumber: string; cardName: string; exp: string; };
}

const PaymentCard = ({ values }: PaymentCardProps) => {
  
    const formatCardNumber = (num: string) => {
    return num.replace(/\s?/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  return (
    <View style={styles.card}>
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.cardNumber}>
            {values.cardNumber ? formatCardNumber(values.cardNumber) : '•••• •••• •••• ••••'}
          </Text>
        </View>
        
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>TITULAR</Text>
            <Text style={styles.text}>{values.cardName || 'TITULAR DE LA TARJETA'}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>VÁLIDA HASTA</Text>
            <Text style={styles.text}>{values.exp || 'MM/YY'}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PaymentCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.contentStrong,
    padding: 20,
    borderRadius: 16,
    shadowColor: colors.contentStrong,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    aspectRatio: 85.60/53.98,
    width: '100%',
    justifyContent:'center',
  },
  label: {
    color: colors.surfaceMuted,
    fontSize: 12,
    marginBottom: 4,
  },
  cardNumber: {
    alignSelf:'center',
    fontSize: 35,
    fontWeight: '600',
    color: colors.brandSecondary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    color: colors.surfaceMuted,
    fontWeight: '500',
  },
});
