import { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  Image,
  TextInput,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import styles from "@/src/styles/Admin.styles";
import { getAllUsers, updateUser, deleteUser } from "@/src/services/userApi"; // Asumiendo que las funciones están en userApi


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
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  // Obtener usuarios al cargar la pantalla
  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await getAllUsers(); // Llamada a la API para obtener los usuarios
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
      const updatedUser = await updateUser(selectedUser.id, selectedUser); // Llamada a la API para actualizar el usuario
      setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
      setModalVisible(false);
    } catch (error) {
      console.error("Error al guardar los cambios", error);
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert("Eliminar Usuario", "¿Estás seguro de que quieres eliminar este usuario?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        onPress: async () => {
          try {
            await deleteUser(id); // Llamada a la API para eliminar el usuario
            setUsers(users.filter((user) => user.id !== id));
          } catch (error) {
            console.error("Error al eliminar el usuario", error);
          }
        },
      },
    ]);
  };

  // Paginación
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Usuarios</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por usuario o email..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={currentUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.categoryItem}>
            <View style={styles.categoryInfo}>
              <Image source={{ uri: item.imageProfile || "https://via.placeholder.com/80" }} style={styles.userImage} />
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{item.name} ({item.authority.authority})</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
                {item.phoneNumber && <Text style={styles.userPhone}>📞 {item.phoneNumber}</Text>}
                <Text style={styles.userDate}>🗓️ Creado: {item.createdUser}</Text>
              </View>
              <View style={styles.buttons}>
                <TouchableOpacity style={styles.editButton} onPress={() => { setSelectedUser(item); setModalVisible(true); }}>
                  <Text style={styles.buttonText}>✏️ Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
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

            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={selectedUser?.name}
              onChangeText={(text) => setSelectedUser((prev) => prev ? { ...prev, name: text } : prev)}
            />
            <TextInput
              style={styles.input}
              placeholder="Usuario"
              value={selectedUser?.username}
              onChangeText={(text) => setSelectedUser((prev) => prev ? { ...prev, username: text } : prev)}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={selectedUser?.email}
              onChangeText={(text) => setSelectedUser((prev) => prev ? { ...prev, email: text } : prev)}
            />
            <TextInput
              style={styles.input}
              placeholder="Teléfono"
              value={selectedUser?.phoneNumber}
              onChangeText={(text) => setSelectedUser((prev) => prev ? { ...prev, phoneNumber: text } : prev)}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.smallButton} onPress={saveChanges}>
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.smallButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
