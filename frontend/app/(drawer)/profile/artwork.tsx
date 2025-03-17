import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const ArtworksScreen = ({ route }: any) => {
    const { artworks } = route.params || {};

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Obras Subidas</Text>
        {artworks && artworks.length > 0 ? (
            <FlatList
                data={artworks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.artworkItem}>
                        <Text style={styles.artworkName}>{item.name}</Text>
                        <Text style={styles.artworkDescription}>{item.description}</Text>
                        <Text style={styles.artworkPrize}>Precio: ${item.prize}</Text>
                    </View>
                )}
            />
        ) : (
            <Text>No tienes obras subidas.</Text>
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
    artworkItem: {
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    artworkName: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    artworkDescription: {
      fontSize: 16,
    },
    artworkPrize: {
      fontSize: 16,
      color: 'green',
    },
  });
  
 
export default ArtworksScreen;
