import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
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
        <Text style={styles.cardTitle}>Acciones Rápidas</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push("/admin/user-manegement")}
          >
            <Text style={styles.buttonText}>Gestionar Usuarios</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push("/admin/category-management")}
          >
            <Text style={styles.buttonText}>Gestionar Categorías</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push("/admin/report-management")}
          >
            <Text style={styles.buttonText}>Gestión de reportes</Text>
          </TouchableOpacity>
        </View>
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
  buttonContainer: {
    flexDirection: "row", // Alinea los botones en fila
    justifyContent: "space-between", // Espacio entre los botones
    marginTop: 10,
  },
  button: {
    backgroundColor: "#4CAF50", // Color verde para los botones
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1, // Hace que los botones se ajusten para que ocupen el mismo espacio
    marginHorizontal: 5, // Añade espacio entre los botones
    alignItems: "center",
  },
  buttonText: {
    color: "#fff", // Texto blanco
    fontSize: 16,
    fontWeight: "500",
  },
});
