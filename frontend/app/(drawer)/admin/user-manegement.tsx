import { useState } from "react";
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

interface BaseUser {
  id: number;
  name: string;
  username: string;
  email: string;
  phoneNumber?: string;
  imageProfile?: string;
  createdUser: string;
  authority: {
    authority: string;
  };
}

export default function UserManagement() {
  const router = useRouter();

  const [users, setUsers] = useState<BaseUser[]>([
    {
      id: 1,
      name: "Juan Pérez",
      username: "juanp",
      email: "juan@example.com",
      phoneNumber: "123456789",
      imageProfile: "https://images.unsplash.com/photo-1506157786151-b8491531f063",
      createdUser: "2024-03-01",
      authority: { authority: "CLIENT" },
    },
    {
      id: 2,
      name: "María López",
      username: "marial",
      email: "maria@example.com",
      phoneNumber: "987654321",
      imageProfile: "https://via.placeholder.com/80",
      createdUser: "2024-02-20",
      authority: { authority: "CLIENT" },
    },
    {
      id: 3,
      name: "Carlos Sánchez",
      username: "carloss",
      email: "carlos@example.com",
      phoneNumber: "555123456",
      imageProfile: "https://via.placeholder.com/80",
      createdUser: "2024-01-15",
      authority: { authority: "CLIENT" },
    },
    {
      id: 4,
      name: "Ana García",
      username: "anag",
      email: "ana@example.com",
      phoneNumber: "555987654",
      imageProfile: "https://via.placeholder.com/80",
      createdUser: "2024-02-05",
      authority: { authority: "ARTIST" },
    },
    {
      id: 5,
      name: "Luis Martínez",
      username: "luism",
      email: "luis@example.com",
      phoneNumber: "555654321",
      imageProfile: "https://via.placeholder.com/80",
      createdUser: "2024-03-10",
      authority: { authority: "ARTIST" },
    },
    {
      id: 6,
      name: "Clara Ramírez",
      username: "clarar",
      email: "clara@example.com",
      phoneNumber: "555789012",
      imageProfile: "https://via.placeholder.com/80",
      createdUser: "2024-01-28",
      authority: { authority: "ARTIST" },
    },
    {
      id: 7,
      name: "Pedro Gómez",
      username: "pedrog",
      email: "pedro@example.com",
      phoneNumber: "555321654",
      imageProfile: "https://via.placeholder.com/80",
      createdUser: "2024-02-14",
      authority: { authority: "ARTIST" },
    },
    {
      id: 8,
      name: "Laura Torres",
      username: "laurat",
      email: "laura@example.com",
      phoneNumber: "555159753",
      imageProfile: "https://via.placeholder.com/80",
      createdUser: "2024-03-05",
      authority: { authority: "ARTIST" },
    },
  ]);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUser, setSelectedUser] = useState<BaseUser | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 6;

    const filteredUsers = users.filter(
        (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const saveChanges = () => {
    if (!selectedUser) return;
    setUsers(users.map((user) => (user.id === selectedUser.id ? selectedUser : user)));
    setModalVisible(false);
  };

  const handleDelete = (id: number) => {
    Alert.alert("Eliminar Usuario", "¿Estás seguro de que quieres eliminar este usuario?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        onPress: () => setUsers(users.filter((user) => user.id !== id)),
      },
    ]);
  };

  // Paginate filtered users
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
          <View style={styles.userCard}>
            <View style={styles.userInfo}>
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
      <View style={styles.pagination}>
        <Button title="Anterior" onPress={handlePrevPage} disabled={currentPage === 1} />
        <Text>{`${currentPage} de ${totalPages}`}</Text>
        <Button title="Siguiente" onPress={handleNextPage} disabled={currentPage === totalPages} />
      </View>

      {/* Modal para editar usuario */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
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

            <View style={styles.modalButtons}>
              <Button title="Guardar" onPress={saveChanges} />
              <Button title="Cancelar" color="gray" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5", width: '90%', alignSelf: 'center' },
  title: { fontSize: 30, fontWeight: "700", marginBottom: 20, textAlign: "center" },
  searchInput: { backgroundColor: "white", padding: 12, borderRadius: 10, fontSize: 18, marginBottom: 15, borderWidth: 1, borderColor: "#ddd" },
  userCard: { backgroundColor: "white", padding: 15, borderRadius: 15, marginBottom: 15, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5 },
  userInfo: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  userImage: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  userDetails: { flex: 1 },
  userName: { fontSize: 20, fontWeight: "bold" },
  userEmail: { fontSize: 16, color: "gray" },
  userPhone: { fontSize: 16, color: "#555" },
  userDate: { fontSize: 14, color: "#888" },
  buttons: { flexDirection: "row", justifyContent: "flex-end", marginTop: 10 }, 
  editButton: { backgroundColor: "#4CAF50", padding: 8, borderRadius: 8, marginLeft: 10, alignItems: "center" },
  deleteButton: { backgroundColor: "#E53935", padding: 8, borderRadius: 8,marginLeft: 10, alignItems: "center" },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  emptyText: { textAlign: "center", fontSize: 20, color: "#666", marginTop: 20 },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "white", padding: 25, borderRadius: 15, width: "85%" },
  modalTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  input: { backgroundColor: "#f0f0f0", padding: 12, borderRadius: 10, fontSize: 18, marginBottom: 15 },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  pagination: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
});
