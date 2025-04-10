import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { KanbanBoard } from '@/src/components/kanban/KanbanBoard';
import { addStatusColumn, fetchStatusesWithCommissions, moveCommissionBack, moveCommissionForward } from '@/src/services/kanbanApi';
import { StatusKanbanCreateDTO, StatusKanbanUpdateDTO, StatusWithCommissions } from '@/src/constants/kanbanTypes';
import { AuthenticationContext } from '@/src/contexts/AuthContext';
import ProtectedRoute from '@/src/components/ProtectedRoute';
import LoadingScreen from '@/src/components/LoadingScreen';

const KanbanScreen: React.FC = () => {
  const { loggedInUser } = useContext(AuthenticationContext);
  const [columns, setColumns] = useState<StatusWithCommissions[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingColumn, setCreatingColumn] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchStatusesWithCommissions(loggedInUser.token);
        setColumns(result);
      } catch (err) {
        Alert.alert('Error', 'No se pudieron cargar los datos del kanban.');
      } finally {
        setLoading(false);
      }
    };
  
    if (loggedInUser?.token) {
      loadData();
    }
  }, [loggedInUser?.token]);
  

  const refresh = async () => {
    try {
      const result = await fetchStatusesWithCommissions(loggedInUser.token);
      setColumns(result);
    } catch (err) {
      console.error('No se pudieron refrescar las columnas.', err);
    }
  };
  

  const handleMoveBack = async (commissionId: number) => {
    try {
      await moveCommissionBack(commissionId, loggedInUser.token);
      refresh();
    } catch (err) {
      Alert.alert('Error', 'No se pudo mover la comisión atrás.');
    }
  };

  const handleMoveForward = async (commissionId: number) => {
    try {
      await moveCommissionForward(commissionId, loggedInUser.token);
      refresh();
    } catch (err) {
      Alert.alert('Error', 'No se pudo mover la comisión adelante.');
    }
  };

  const handleUpdateColumn = (updated: StatusKanbanUpdateDTO) => {
    setColumns(prev => prev.map(columna => columna.status.id === updated.id ? 
        { ...columna,
          status: { 
            ...columna.status,
            name: updated.name,
            description: updated.description,
            color: updated.color
          }
        } 
        : columna
      )
    )
  }

  const handleCreateColumn = async (created: StatusKanbanCreateDTO) => {
    await addStatusColumn(created, loggedInUser.token)
    await refresh()
  };  

  if (loading) return <LoadingScreen/>

  return (
    <ProtectedRoute allowedRoles={['ARTIST']}>
      <View style={{flex: 1}}>
        <KanbanBoard
          columns={columns}
          onMoveBack={handleMoveBack}
          onMoveForward={handleMoveForward}
          token={loggedInUser.token}
          onDeleteColumn={(deletedId) => { setColumns(prev => prev.filter(c => c.status.id !== deletedId))}}
          onUpdateColumn={handleUpdateColumn}
          onAddColumn={handleCreateColumn}
        />
      </View>
    </ProtectedRoute>
  );
};

export default KanbanScreen;

