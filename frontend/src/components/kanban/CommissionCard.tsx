import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { StatusKanbanWithCommissionsDTO } from '@/src/constants/kanbanTypes';
import { cardStyles } from '@/src/styles/Kanban.styles';
import { PaymentArrangement } from '@/src/constants/CommissionTypes';
import { getCommissionById } from '@/src/services/commisionApi';
import { useLocalSearchParams } from 'expo-router';

interface CommissionCardProps {
  commission: StatusKanbanWithCommissionsDTO;
  statusIndex: number;
  maxIndex: number;
  onMoveBack: () => void;
  onMoveForward: () => void;
}

export const CommissionCard: React.FC<CommissionCardProps> = ({
  commission,
  statusIndex,
  maxIndex,
  onMoveBack,
  onMoveForward,
}) => {
  const canMoveBack = statusIndex > 0;
  const isLastColumn = statusIndex === maxIndex;
  const { commissionId } = useLocalSearchParams();
  const [paymentArrangement, setPaymentArrangement] = useState<String | null> (null);

  useEffect(() => {
        const intervalId = setInterval(async () => {
          try {
            const commission = await getCommissionById(Number(commissionId));
            setPaymentArrangement(commission.paymentArrangement);
          } catch (err) {
            console.error("Error al obtener el tipo de pago:", err);
          }
        }, 2000); // cada 2 segundos
      
        return () => clearInterval(intervalId); // limpiar al desmontar
      }, [commissionId]); 


  return (
    <View style={cardStyles.card}>
      <Text style={cardStyles.title}>{commission.name}</Text>
      <Text style={cardStyles.client}>{commission.description}</Text>
      <Text style={cardStyles.client}>Ordered by @{commission.clientUsername}</Text>
      <Text style={cardStyles.client}>{commission.price}€</Text>
      {commission.isWaitingPayment && (
        <Text style={[cardStyles.client, { color: 'red', fontWeight: 'bold' }]}>
          Pendiente de pago
        </Text>
      )}

      <View style={cardStyles.buttonRow}>
        {canMoveBack && (
          <TouchableOpacity style={cardStyles.button} onPress={onMoveBack}>
            <Icon name="arrow-left" size={16} color="#444" />
          </TouchableOpacity>
        )}

  {paymentArrangement !== "MODERATOR" && (<TouchableOpacity style={cardStyles.button} onPress={onMoveForward}>
          <Icon name={isLastColumn ? 'archive' : 'arrow-right'} size={16} color="#444" />
        </TouchableOpacity>)}
        
       {paymentArrangement === "MODERATOR" && (<TouchableOpacity style={cardStyles.button} onPress={() => {
    Alert.alert(
    '¿Confirmar movimiento?',
    'Si mueve de estado la comisión, se solicitará otro pago al cliente y por ende, hasta que no pague, no podrá volver a mover la comisión.',
    [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Aceptar', onPress: onMoveForward }
    ]
  );
}}>
  <Icon name={isLastColumn ? 'archive' : 'arrow-right'} size={16} color="#444" />
</TouchableOpacity>)}
      </View>
    </View>
  );
};
