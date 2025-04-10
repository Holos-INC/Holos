import { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  Image,
  TextInput,
  Modal,
  TouchableOpacity,
  Alert,
  ScrollView,

} from "react-native";
import { useRouter } from "expo-router";
import styles from "@/src/styles/Admin.styles";
import { getAllUsers, updateUser, deleteUser } from "@/src/services/userApi"; // Asumiendo que las funciones están en userApi
import { deleteClient } from "@/src/services/clientApi";
import { deleteArtist } from "@/src/services/artistApi";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import * as yup from "yup";


interface Authority {
  id: number;
  authority: string;
}

interface BaseUser {
  id: number;
  name: string;
  username: string;
  email: string;
  phoneNumber?: string;
  imageProfile?: string;
  createdUser: string;
  authority: Authority;
}

export default function UserManagement() {
  const router = useRouter();
  const [users, setUsers] = useState<BaseUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<BaseUser | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { loggedInUser } = useContext(AuthenticationContext);
  const [editErrorMessage, setEditErrorMessage] = useState<string | null>(null);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;
  const flatListRef = useRef<FlatList<BaseUser>>(null);

  const editUserValidationSchema = yup.object().shape({
    name: yup
      .string()
      .required("El nombre es obligatorio")
      .max(50, "El nombre no puede superar los 50 caracteres"),
  
    username: yup
      .string()
      .required("El nombre de usuario es obligatorio")
      .max(20, "El nombre de usuario no puede superar los 20 caracteres"),
  
    email: yup
      .string()
      .email("Ingrese un correo válido")
      .required("El correo es obligatorio"),
  
    phoneNumber: yup
      .string()
      .matches(/^\d{9,10}$/, "El teléfono debe contener 9 dígitos")
      .notRequired(), // No es obligatorio, pero si se ingresa, debe cumplir la regla
  });

  // Obtener usuarios al cargar la pantalla
  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await getAllUsers(loggedInUser.token); 
        setUsers(data);
      } catch (error) {
        console.error("Error al obtener usuarios", error);
      }
    };
    getUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const saveChanges = async () => {
    if (!selectedUser) return;
  
    try {
      await editUserValidationSchema.validate(selectedUser, { abortEarly: false });
  
      const updatedUser = await updateUser(selectedUser.id, selectedUser, loggedInUser.token);
      setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
      setModalVisible(false);
      setEditErrorMessage(null); // Limpiar error si es exitoso
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        setEditErrorMessage(error.errors.join("\n"));
      } else {
        setEditErrorMessage("Error al guardar los cambios. Inténtalo de nuevo.");
      }
      console.error("Error al guardar los cambios", error);
    }
  };
  

  const handleDelete = async (id: number, authority: string) => {
    if (!id) {
      setDeleteErrorMessage("ID de usuario inválido.");
      return;
    }
    const userToDelete = users.find(user => user.id === id);
    const userName = userToDelete ? userToDelete.name : "Usuario desconocido";
    try {
      if (authority === "CLIENT") {
        await deleteClient(id, loggedInUser.token);
        alert(`Eliminado cliente: ${userName}`);
      } else if (authority === "ARTIST") {
        await deleteArtist(id, loggedInUser.token);
        alert(`Eliminado artista: ${userName}`);
      } else {
        setDeleteErrorMessage("Tipo de usuario no válido.");
        return;
      }
  
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      setDeleteErrorMessage(null);
    } catch (error: any) {
      let formattedMessage = "Error al eliminar el usuario. Inténtalo de nuevo.";
  
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (typeof errorData === "string") {
          formattedMessage = errorData.includes(":")
            ? errorData.split(":")[1].trim()
            : errorData;
        }
        else if (typeof errorData === "object" && errorData.message) {
          formattedMessage = errorData.message.includes(":")
            ? errorData.message.split(":")[1].trim()
            : errorData.message;
        }
      }
  
      setDeleteErrorMessage(formattedMessage);
      console.error("Error al eliminar el usuario:", error);
    }
  };

  // Paginación
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      // Mover scroll hacia arriba
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  };

  useEffect(() => {
    setEditErrorMessage(null);
    setDeleteErrorMessage(null);
  }, [currentPage, modalVisible]);
  

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <View style={styles.container}>
        <Text style={styles.title}>Gestión de Usuarios</Text>
        
        <Text style={styles.errorText} testID="deleteErrorMessage">{deleteErrorMessage}</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por usuario o email..."
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            setCurrentPage(1); 
          }}
        />

        <FlatList
          ref={flatListRef}
          data={currentUsers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.categoryItem}>
              <View style={styles.categoryInfo}>
                <Image source={{ uri: item.imageProfile || "https://via.placeholder.com/80" }} style={styles.userImage} />
                <View style={styles.userDetails}>
                  <Text style={styles.userName} testID="userName">{item.name} ({item.authority.authority})</Text>
                  <Text style={styles.userEmail} testID="email">{item.email}</Text>
                  {item.phoneNumber && <Text style={styles.userPhone} testID="phoneNumber">📞 {item.phoneNumber}</Text>}
                  <Text style={styles.userDate} testID="date">🗓️ Creado: {item.createdUser}</Text>
                </View>
                <View style={styles.buttons}>
                  <TouchableOpacity style={styles.editButton} testID={"editButton"} onPress={() => { setSelectedUser(item); setModalVisible(true); }}>
                    <Text style={styles.buttonText}>✏️ Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.deleteButton} 
                    testID={"deleteButton"}
                    onPress={() => handleDelete(item.id, item.authority.authority)}
                  >
                    <Text style={styles.buttonText}>🗑️ Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No se encontraron usuarios</Text>}
        />

        {/* Paginación */}
        <View style={styles.paginationContainer}>
          <TouchableOpacity 
            style={styles.paginationButton} 
            onPress={handlePrevPage} 
            disabled={currentPage === 1}
          >
            <Text style={styles.paginationButtonText}>Anterior</Text>
          </TouchableOpacity>
          <Text style={styles.paginationText}>{`${currentPage} de ${totalPages}`}</Text>
          <TouchableOpacity 
            style={styles.paginationButton} 
            onPress={handleNextPage} 
            disabled={currentPage === totalPages}
          >
            <Text style={styles.paginationButtonText}>Siguiente</Text>
          </TouchableOpacity>
        </View>

        {/* Modal para editar usuario */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Editar Usuario</Text>
              
              <Text style={styles.errorText} testID="errorMessage">{editErrorMessage}</Text>

              <TextInput
                testID="nameInput"
                style={styles.input}
                placeholder="Nombre"
                value={selectedUser?.name}
                onChangeText={(text) => setSelectedUser((prev) => prev ? { ...prev, name: text } : prev)}
              />
              <TextInput
                testID="usernameInput"
                style={styles.input}
                placeholder="Usuario"
                value={selectedUser?.username}
                onChangeText={(text) => setSelectedUser((prev) => prev ? { ...prev, username: text } : prev)}
              />
              <TextInput
                testID="emailInput"
                style={styles.input}
                placeholder="Email"
                value={selectedUser?.email}
                onChangeText={(text) => setSelectedUser((prev) => prev ? { ...prev, email: text } : prev)}
              />
              <TextInput
                testID="phoneInput"
                style={styles.input}
                placeholder="Teléfono"
                value={selectedUser?.phoneNumber}
                onChangeText={(text) => setSelectedUser((prev) => prev ? { ...prev, phoneNumber: text } : prev)}
              />

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.smallButton} onPress={saveChanges}>
                  <Text style={styles.buttonText} testID="saveButton">Guardar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.smallButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ProtectedRoute>
  );
}