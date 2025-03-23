import { StyleSheet } from "react-native";

export const cardStyles = StyleSheet.create({
    card: {
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 12,
      marginVertical: 8,
      marginHorizontal: 4,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
    },
    title: {
      fontWeight: '600',
      fontSize: 16,
      marginBottom: 4,
    },
    client: {
      fontSize: 14,
      color: '#555',
    },
    status: {
      fontSize: 12,
      color: '#888',
      marginBottom: 8,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 8,
    },
    button: {
      backgroundColor: '#f5f5f5',
      padding: 6,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOpacity: 0.04,
      shadowRadius: 2,
      shadowOffset: { width: 0, height: 1 },
      elevation: 2,
    },
  });
  