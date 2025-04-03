import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CommissionCard } from './CommissionCard';
import { StatusWithCommissions } from '@/src/constants/kanbanTypes';
import { ScrollView } from 'react-native-gesture-handler';
import { DropdownMenu } from '../DropdownMenu';
import { deleteStatusColumn } from '@/src/services/kanbanApi';
import { DeleteConfirmationDialog } from '../DeleteConfirmationDialog';

interface KanbanBoardProps {
    columns: StatusWithCommissions[];
    onMoveBack: (commissionId: number) => void;
    onMoveForward: (commissionId: number) => void;
    token: string;
    onDeleteColumn: (deletedId: number) => void 
}  

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ columns, onMoveBack, onMoveForward, token, onDeleteColumn }) => {
  const [columnIdToDelete, setColumnIdToDelete] = useState<number | null>(null)

  const handleConfirmDeleteColumn = async () => {
    if (columnIdToDelete === null) return
    try {
      await deleteStatusColumn(columnIdToDelete, token)
      onDeleteColumn(columnIdToDelete)
    } catch (err) {
      console.error(err)
    } finally {
      setColumnIdToDelete(null)
    }
  }

  return (
    <>
      <ScrollView horizontal contentContainerStyle={styles.board}>
          {columns.map((column, index) => (
              <View key={column.status.name} style={styles.column}>
                  <Text style={styles.columnTitle}>{column.status.name}</Text>
                  <DropdownMenu
                    actions={[
                      { label: 'Editar', onPress: () => console.log('Rename!') },
                      { label: 'Eliminar', onPress: () => setColumnIdToDelete(column.status.id), danger: true },
                    ]}
                  />
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
      <DeleteConfirmationDialog
        visible={columnIdToDelete !== null}
        onCancel={() => setColumnIdToDelete(null)}
        onConfirm={handleConfirmDeleteColumn}
      />
    </>
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
