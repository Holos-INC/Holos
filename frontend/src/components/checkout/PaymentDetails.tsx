import { Commission, CommissionDTO } from '@/src/constants/CommissionTypes';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '@/src/constants/colors';

type Props = {
  commission: CommissionDTO;
};

const PaymentDetails = ({ commission }: Props) => {
  return (
    <View style={styles.ticket}>
      <Text style={styles.header}>Detalles del pago</Text>
      <View style={styles.separator} />

      <View style={styles.row}><Text style={styles.label}>Título:</Text><View style={styles.dots} /><Text style={styles.value}>{commission.name}</Text></View>
      <View style={styles.row}><Text style={styles.label}>Artista:</Text><View style={styles.dots} /><Text style={styles.value}>{commission.artistUsername}</Text></View>

      <View style={styles.separator} />

      <View style={styles.row}><Text style={styles.label}>Total:</Text><View style={styles.dots} /><Text style={styles.total}>{Math.round(commission.price * 1.06 * 100) / 100}€</Text></View>
    </View>
  );
};

export default PaymentDetails;

const styles = StyleSheet.create({
  ticket: {
    backgroundColor: colors.surfaceBase,
    borderRadius: 5,
    padding: 20,
    alignSelf: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },  
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.contentStrong,
    marginBottom: 12,
    textAlign: 'center',
  },
  separator: {
    height: 2,
    backgroundColor: colors.contentStrong,
    marginVertical: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  label: {
    color: colors.contentStrong,
    fontSize: 14,
    minWidth: 70,
  },
  dots: {
    flex: 1,
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    borderColor: colors.accentInfo,
    marginHorizontal: 6,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.brandPrimary,
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.brandPrimary,
  },
});
