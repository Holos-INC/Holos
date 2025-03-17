// src/screens/OrderHistoryScreen.js
import React from 'react';
import { View, Text, StyleSheet,FlatList } from 'react-native';

const OrderHistoryScreen = ({ route }: any) => {
    const { orders } = route.params || {};
    
     return (
        <View style={styles.container}>
        <Text style={styles.title}>Historial de Pedidos</Text>
        {orders && orders.length > 0 ? (
            <FlatList
                data={orders}
                keyExtractor={(item) => item.id.toString()} 
                renderItem={({ item }) => (
                <View style={styles.orderItem}>
                    <Text style={styles.orderName}>{item.name}</Text>
                    <Text style={styles.orderDescription}>{item.description}</Text>
                    <Text style={styles.orderPrize}>Precio: ${item.prize}</Text>
                </View>
                )}
            />
        ) : (
            <Text>No tienes pedidos registrados.</Text>
        )}
        </View>
        );
    };

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          padding: 20,
        },
        title: {
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 20,
        },
        orderItem: { 
            padding: 15,
            marginBottom: 10,
            borderWidth: 1,
            borderColor: '#E5E7EB',
            borderRadius: 5,
            backgroundColor: '#fff',
        },
        orderName: {
          fontSize: 18,
          fontWeight: 'bold',
        },
        orderDescription: {
          fontSize: 16,
        },
        orderPrize: {
          fontSize: 16,
          color: 'green',
        },
      });
      

export default OrderHistoryScreen;
