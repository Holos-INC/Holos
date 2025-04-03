import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CommissionCard } from './CommissionCard';
import { StatusWithCommissions } from '@/src/constants/kanbanTypes';
import { ScrollView } from 'react-native-gesture-handler';

interface KanbanBoardProps {
    columns: StatusWithCommissions[];
    onMoveBack: (commissionId: number) => void;
    onMoveForward: (commissionId: number) => void;
}  

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ columns, onMoveBack, onMoveForward }) => {
  return (
    <ScrollView horizontal contentContainerStyle={styles.board}>
        {columns.map((column, index) => (
            <View key={column.status.name} style={styles.column}>
                <Text style={styles.columnTitle}>{column.status.name}</Text>
                <ScrollView style={styles.columnScroll} contentContainerStyle={styles.cardList}>
                  {column.commissions.map(commission => (
                      <CommissionCard
                          key={commission.id}
                          commission={commission}
                          statusIndex={index}
                          maxIndex={columns.length - 1}
                          onMoveBack={() => onMoveBack(commission.id)}
                          onMoveForward={() => onMoveForward(commission.id)}
                      />
                  ))}
                </ScrollView>
            </View>
        ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({  
  columnScroll: {
    flex: 1,
    maxHeight: '90%',
  },
  cardList: {
    paddingVertical: 8,
    gap: 8,
  },  
  board: {
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  column: {
    width: 280,
    marginHorizontal: 16,
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    color: '#444',
  },
});
