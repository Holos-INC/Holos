import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CommissionCard } from './CommissionCard';
import { StatusKanbanUpdateDTO, StatusWithCommissions } from '@/src/constants/kanbanTypes';
import { ScrollView } from 'react-native-gesture-handler';
import { DropdownMenu } from '../DropdownMenu';
import { updateStatusColumn, deleteStatusColumn } from '@/src/services/kanbanApi';
import { DeleteConfirmationDialog } from '../DeleteConfirmationDialog';
import { EditStatusDialog } from './EditStatusDialog';

interface KanbanBoardProps {
    columns: StatusWithCommissions[];
    onMoveBack: (commissionId: number) => void;
    onMoveForward: (commissionId: number) => void;
    token: string;
    onDeleteColumn: (deletedId: number) => void
    onUpdateColumn: (updated: StatusKanbanUpdateDTO) => void
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ columns, onMoveBack, onMoveForward, token, onDeleteColumn, onUpdateColumn }) => {
  const [columnIdToDelete, setColumnIdToDelete] = useState<number | null>(null)
  const [editingColumn, setEditingColumn] = useState<StatusWithCommissions | null>(null)
  const [editError, setEditError] = useState<string | null>(null)

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

  const handleConfirmEditColumn = async ({ name, description, color }: { name: string, description: string, color: string }) => {
    if (!editingColumn) return
    try {
      setEditError(null)
  
      await updateStatusColumn( { id: editingColumn.status.id, nombre: name, description, color }, token )
      onUpdateColumn({ id: editingColumn.status.id, nombre: name, description, color })
      setEditingColumn(null)
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Hubo un error al actualizar la columna 😿'
      console.error(message)
      setEditError(message)
    }
  }

  const handleCancelEdit = () => {
    setEditError(null)
    setEditingColumn(null)
  }  

  const getDropdownActions = (column: StatusWithCommissions) => [
    { label: 'Editar', onPress: () => setEditingColumn(column) },
    { label: 'Eliminar', onPress: () => setColumnIdToDelete(column.status.id), danger: true },
  ]  

  return (
    <>
      <ScrollView horizontal contentContainerStyle={styles.board}>
        {columns.map((column, index) => (
          <View key={column.status.name} style={[styles.column, { backgroundColor: column.status.color ?? '#f5f5f5' }]}>
            <View style={styles.columnHeader}>
              <Text style={styles.columnTitle}>{column.status.name}</Text>
              {column.status.description && ( <Text style={styles.columnDescription}>{column.status.description}</Text> )}
              <DropdownMenu actions={getDropdownActions(column)} />
            </View>
          
            <View style={styles.columnBody}>
              <ScrollView style={styles.columnScroll} contentContainerStyle={styles.cardList}>
                {column.commissions.map((commission) => (
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
          </View>
        
        ))}
      </ScrollView>
  
      {/* Dialogs */}
      <EditStatusDialog
        visible={editingColumn !== null}
        initialName={editingColumn?.status.name ?? ''}
        initialDescription={editingColumn?.status.description ?? ''}
        initialColor={editingColumn?.status.color ?? '#cccccc'}
        onCancel={handleCancelEdit}
        onSave={handleConfirmEditColumn}
        error={editError}
      />
      <DeleteConfirmationDialog
        visible={columnIdToDelete !== null}
        onCancel={() => setColumnIdToDelete(null)}
        onConfirm={handleConfirmDeleteColumn}
      />
    </>
  );
  
};

const styles = StyleSheet.create({
  board: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 16,
    height: '100%'
  },  
  column: {
    width: 280,
    height: '95%',
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  columnScroll: {
    flex: 1,
    maxHeight: '90%',
  },
  cardList: {
    paddingVertical: 8,
    gap: 8,
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    color: '#444',
  },
  columnDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  columnHeader: {
    backgroundColor: 'white',
    padding: 12,
    width: '100%'
  },
  columnBody: {
    padding: 12,
    flex: 1,
  }
});
