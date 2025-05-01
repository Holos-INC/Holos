import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { StatusKanbanWithCommissionsDTO } from '@/src/constants/kanbanTypes';
import { cardStyles } from '@/src/styles/Kanban.styles';

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
        
        <TouchableOpacity style={cardStyles.button} onPress={onMoveForward}>
          <Icon name={isLastColumn ? 'archive' : 'arrow-right'} size={16} color="#444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
