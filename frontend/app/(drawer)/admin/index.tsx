import { View, Text, Button, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

// Definir la estructura de un usuario
interface BaseUser {
  id: number;
  name: string;
  username: string;
  password: string;
  email: string;
  phoneNumber?: string; 
  imageProfile?: string; 
  createdUser: string; 
  authority: {
    authority: string;
  };
}

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Panel de Administración</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Estadísticas</Text>
        <Text>Total Usuarios: 1200</Text>
        <Text>Total Pedidos: 350</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Acciones Rápidas</Text>
        <Button title="Gestionar Usuarios" onPress={() => router.push("/admin/user-manegement")} />
        <Button title="Ver Pedidos" />
        <Button title="Configuraciones" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
});
