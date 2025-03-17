import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, Image, Button, StyleSheet, Platform, ScrollView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getArtistById } from "@/src/services/ArtistService";
import { getClientById } from "@/src/services/ClientService";
import { AuthenticationContext } from "@/src/contexts/AuthContext";

const isWeb = Platform.OS === "web";

// Tipos propios
interface Order {
  id: number;
  name: string;
  description: string;
  prize: number;
}

interface ClientUser {
  id: number;
  name: string;
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
  imageProfile: string;
  createdUser: string;
  orders: Order[];
}

interface Artist {
  id: number;
  name: string;
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
  imageProfile: string;
  createdUser: string;
  authority: {
    id: number;
    authority: string;
  };
  numSlotsOfWork: number;
  tableCommisionsPrice?: string;
}

type User = ClientUser | Artist;

const UserProfileScreen = () => {
  const BASE_URL = "http://localhost:8080";
  const navigation = useNavigation<any>();
  const { loggedInUser } = useContext(AuthenticationContext);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!loggedInUser || !loggedInUser.id) {
        Alert.alert("Error", "No se encontró el usuario autenticado.");
        setLoading(false);
        return;
      }

      try {
        // Intentamos obtener el cliente usando el id del usuario autenticado
        const client = await getClientById(loggedInUser.id);
        setUser(client);
      } catch (error) {
        console.warn(
          "No se encontró cliente, intentando con artista...",
          error
        );
        try {
          // Si no se obtiene cliente, se intenta obtener el artista usando el id
          const artist = await getArtistById(loggedInUser.id);
          setUser(artist);
        } catch (err) {
          console.error("Error fetching user:", err);
          Alert.alert("Error", "No se pudo cargar el usuario.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [loggedInUser]);
  
  useEffect(() => {
      navigation.setOptions({ title: `${user?.username}'s profile` });
    }, [navigation, user]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!user) {
    return <Text>No se pudo cargar el usuario.</Text>;
  }

  // Determinamos si el usuario es artista verificando si tiene tableCommisionsPrice
  const isArtist = "tableCommisionsPrice" in user && user.tableCommisionsPrice;

  const handleEdit = () => {
    console.log("Editar perfil");
    Alert.alert("Editar", "Funcionalidad de edición de perfil");
  };

  // Para el cliente se navega al historial de pedidos
  const navigateToOrderHistory = () => {
    if ("orders" in user) {
      navigation.navigate("Historial de Pedidos", { orders: user.orders });
    }
  };

  // Para el artista se navega a la pantalla que muestra la tabla de comisiones
  const navigateToCommissionTable = () => {
    if (isArtist) {
      navigation.navigate("Tabla de Comisiones", {
        image: user.tableCommisionsPrice,
      });
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>{isArtist ? "ARTISTA" : "CLIENTE"}</Text>
        <Image
          source={{ uri: `${BASE_URL}${user.imageProfile}` }}
          style={styles.image}
        />
        <Text style={styles.label}>
          DATOS {isArtist ? "ARTISTA" : "CLIENTE"}
        </Text>
        <Text style={styles.fieldLabel}>Nombre:</Text>
        <TextInput style={styles.input} value={user.name} editable={false} />
        <Text style={styles.fieldLabel}>Usuario:</Text>
        <TextInput
          style={styles.input}
          value={user.username}
          editable={false}
        />
        <Text style={styles.fieldLabel}>Correo Electrónico:</Text>
        <TextInput style={styles.input} value={user.email} editable={false} />
        <Text style={styles.fieldLabel}>Teléfono:</Text>
        <TextInput
          style={styles.input}
          value={user.phoneNumber}
          editable={false}
        />

        {isArtist ? (
          <>
            {user.tableCommisionsPrice && (
              <View style={styles.commissionContainer}>
                <Text style={styles.fieldLabel}>Tabla de Comisiones:</Text>
                <Image
                  source={{ uri: `${BASE_URL}${user.tableCommisionsPrice}` }}
                  style={styles.commissionImage}
                />
              </View>
            )}
            <View style={styles.buttonsContainer}>
              <Button
                title="Ver Tabla de Comisiones"
                onPress={navigateToCommissionTable}
                color="#1E3A8A"
              />
            </View>
          </>
        ) : (
          <View style={styles.buttonsContainer}>
            <Button
              title="Ver Historial de Pedidos"
              onPress={navigateToOrderHistory}
              color="#1E3A8A"
            />
          </View>
        )}
        <View style={styles.buttonsContainer}>
          <Button title="EDITAR" onPress={handleEdit} color="#1E3A8A" />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#F9FAFB",
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 5,
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginTop: 5,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#374151",
    marginTop: 5,
  },
  input: {
    width: "80%",
    padding: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
    textAlign: "center",
  },
  buttonsContainer: {
    justifyContent: "center",
    marginTop: 10,
    gap: 10,
    width: isWeb ? "20%" : "80%",
  },
  commissionContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  commissionImage: {
    width: "90%",
    height: 150,
    resizeMode: "contain",
    marginTop: 5,
    borderRadius: 5,
  },
});

export default UserProfileScreen;
