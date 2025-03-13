import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Button,
  StyleSheet,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getArtistById } from "../../../services/ArtistService";
import { getClientById } from "../../../services/ClientService";
import { AuthenticationContext } from "../../../context/AuthContext"; // Ajusta la ruta según tu proyecto
import { getUserTypeById, updateUserById } from "@/app/services/UserService";

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
    const [isEditable, setIsEditable] = useState(false);  
    const [userType, setUserType] = useState("");
  
    // Estados locales para los campos editables
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    
  
    useEffect(() => {
      const fetchUser = async () => {
        if (!loggedInUser || !loggedInUser.id) {
          Alert.alert("Error", "No se encontró el usuario autenticado.");
          setLoading(false);
          return;
        }
    
        setLoading(true); // Marcar como cargando
    
        try {
          // Obtener el tipo de usuario
          const userType = await getUserTypeById(loggedInUser.id);
    
          // Verificar si el tipo de usuario es un cliente o un artista
          if (userType === 'CLIENT') {
            const client = await getClientById(loggedInUser.id);
            setUser(client);
          } else if (userType === 'ARTIST') {
            const artist = await getArtistById(loggedInUser.id);
            setUser(artist);
          } else {
            throw new Error('Tipo de usuario desconocido');
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        } finally {
          setLoading(false); // Terminar el estado de carga
        }
      };
    
      fetchUser();
    }, [loggedInUser]);
  
    useEffect(() => {
      if (user) {
        setName(user.name);
        setUsername(user.username);
        setEmail(user.email);
        setPhoneNumber(user.phoneNumber);
      }
    }, [user]);
  
    if (loading) {
      return <Text>Loading...</Text>;
    }
  
    if (!user) {
      return <Text>No se pudo cargar el usuario.</Text>;
    }
  
    const isArtist = "tableCommisionsPrice" in user && user.tableCommisionsPrice;
  
    const handleEdit = async () => {
      if (isEditable) {
        try {
          const updatedData = { name, username, email, phoneNumber };
          await updateUserById(loggedInUser.id, updatedData);
          Alert.alert("Éxito", "Perfil actualizado correctamente.");
        } catch (error) {
          Alert.alert("Error", "No se pudo actualizar el perfil.");
        }
      }
      setIsEditable(!isEditable);
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
          <Image source={{ uri: `${BASE_URL}${user.imageProfile}` }} style={styles.image} />
          <Text style={styles.label}>DATOS {isArtist ? "ARTISTA" : "CLIENTE"}</Text>
  
          <Text style={styles.fieldLabel}>Nombre:</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName} // Permite modificar el estado
            editable={isEditable}
          />
  
          <Text style={styles.fieldLabel}>Usuario:</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            editable={isEditable}
          />
  
          <Text style={styles.fieldLabel}>Correo Electrónico:</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            editable={isEditable}
          />
  
          <Text style={styles.fieldLabel}>Teléfono:</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            editable={isEditable}
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
            <Button title={isEditable ? "GUARDAR" : "EDITAR"} onPress={handleEdit} color="#1E3A8A" />
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
