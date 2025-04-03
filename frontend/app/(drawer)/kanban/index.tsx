import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { KanbanBoard } from '@/src/components/kanban/KanbanBoard';
import { fetchStatusesWithCommissions, moveCommissionBack, moveCommissionForward } from '@/src/services/kanbanApi';
import { StatusKanbanUpdateDTO, StatusWithCommissions } from '@/src/constants/kanbanTypes';
import { AuthenticationContext } from '@/src/contexts/AuthContext';
import ProtectedRoute from '@/src/components/ProtectedRoute';
import LoadingScreen from '@/src/components/LoadingScreen';

const KanbanScreen: React.FC = () => {
  const { loggedInUser } = useContext(AuthenticationContext);
  const [columns, setColumns] = useState<StatusWithCommissions[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchStatusesWithCommissions(loggedInUser.token);
        setColumns(result);
      } catch (err) {
        Alert.alert('Error', 'Failed to load Kanban data.');
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
      console.error('Failed to refresh columns', err);
    }
  };
  

  const handleMoveBack = async (commissionId: number) => {
    try {
      await moveCommissionBack(commissionId, loggedInUser.token);
      refresh();
    } catch (err) {
      Alert.alert('Error', 'Could not move commission backward.');
    }
  };

  const handleMoveForward = async (commissionId: number) => {
    try {
      await moveCommissionForward(commissionId, loggedInUser.token);
      refresh();
    } catch (err) {
      Alert.alert('Error', 'Could not move commission forward.');
    }
  };

  const handleUpdateColumn = (updated: StatusKanbanUpdateDTO) => {
    setColumns(prev => prev.map(columna => columna.status.id === updated.id ? 
        { ...columna, status: { ...columna.status, name: updated.nombre, description: updated.description, color: updated.color }} 
        : columna
      )
    )
  }

  if (loading) return <LoadingScreen/>

  return (
    <ProtectedRoute allowedRoles={['ARTIST']}>
      <View style={styles.centered}>
        <KanbanBoard
          columns={columns}
          onMoveBack={handleMoveBack}
          onMoveForward={handleMoveForward}
          token={loggedInUser.token}
          onDeleteColumn={(deletedId) => {
            setColumns(prev => prev.filter(c => c.status.id !== deletedId))
          }}
          onUpdateColumn={handleUpdateColumn}
        />
      </View>
    </ProtectedRoute>
  );
};

export default KanbanScreen;

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
