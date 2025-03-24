import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { KanbanBoard } from '@/src/components/kanban/KanbanBoard';
import { fetchStatusesWithCommissions, moveCommissionBack, moveCommissionForward } from '@/src/services/kanbanApi';
import { StatusWithCommissions } from '@/src/constants/kanbanTypes';
import { AuthenticationContext } from '@/src/contexts/AuthContext';
import ProtectedRoute from '@/src/components/ProtectedRoute';

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

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#888" />
      </View>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['ARTIST']}>
      <View style={styles.container}>
        <KanbanBoard
          columns={columns}
          onMoveBack={handleMoveBack}
          onMoveForward={handleMoveForward}
        />
      </View>
    </ProtectedRoute>
  );
};

export default KanbanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
    justifyContent: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
