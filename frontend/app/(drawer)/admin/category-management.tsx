import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, Modal, TouchableOpacity, Image, Alert } from "react-native";
import styles from "./styles";

interface Category {
  id?: number;
  name: string;
  description: string;
  image?: string;
}

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState<Category>({ name: "", description: "", image: "" });
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCategories([
      { id: 1, name: "Pintura", description: "Obras de arte pictóricas", image: "https://images.unsplash.com/photo-1506157786151-b8491531f063" },
      { id: 2, name: "Escultura", description: "Obras en tres dimensiones", image: "https://via.placeholder.com/100" },
      { id: 3, name: "Dibujo", description: "Arte de representar imágenes", image: "https://via.placeholder.com/100" },
      { id: 4, name: "Fotografía", description: "Arte de capturar imágenes", image: "https://via.placeholder.com/100" },
      { id: 5, name: "Música", description: "Arte de producir sonidos", image: "https://via.placeholder.com/100" },
      { id: 6, name: "Literatura", description: "Arte de escribir", image: "https://via.placeholder.com/100" },
      { id: 7, name: "Danza", description: "Arte de moverse al ritmo de la música", image: "https://via.placeholder.com/100" },
      { id: 8, name: "Teatro", description: "Arte de la actuación", image: "https://via.placeholder.com/100" },
      { id: 9, name: "Cine", description: "Arte del cine", image: "https://via.placeholder.com/100" },
      { id: 10, name: "Artesanía", description: "Trabajo artesanal con materiales", image: "https://via.placeholder.com/100" },
      { id: 11, name: "Arquitectura", description: "Diseño y construcción de edificios", image: "https://via.placeholder.com/100" },
    ]);
  }, []);

  // Filtrar las categorías basadas en el texto de búsqueda
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Obtener las categorías que se deben mostrar en la página actual
  const currentCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddCategory = () => {
    if (!newCategory.name.trim() || !newCategory.description.trim()) return;
    setCategories([...categories, { ...newCategory, id: Date.now() }]);
    setNewCategory({ name: "", description: "", image: "" });
    setModalVisible(false);
  };

  const handleEditCategory = () => {
    if (!editingCategory) return;
    setCategories(categories.map(cat => (cat.id === editingCategory.id ? editingCategory : cat)));
    setEditModalVisible(false);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory({ ...category });
    setEditModalVisible(true);
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    setCurrentPage(1); // Volver a la primera página al buscar
  };

  const handleDelete = (categoryId: number) => {
    Alert.alert(
      "Eliminar Categoría",
      "¿Estás seguro de que quieres eliminar esta categoría?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: () => {
            // Filtrar la categoría eliminada
            setCategories(categories.filter((category) => category.id !== categoryId));
          },
        },
      ]
    );
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Administrar Categorías</Text>

      {/* Buscador */}
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por nombre"
        value={searchText}
        onChangeText={handleSearch}
      />

      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Añadir Nueva Categoría</Text>
      </TouchableOpacity>

      <FlatList
        data={currentCategories}
        keyExtractor={(item) => item.id?.toString() || ""}
        renderItem={({ item }) => (
          <View style={styles.categoryItem}>
            {item.image && <Image source={{ uri: item.image }} style={styles.categoryImage} />}
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryText}>{item.name}</Text>
              <Text style={styles.categoryDescription}>{item.description}</Text>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={() => openEditModal(item)}>
              <Text style={styles.buttonText}>✏️ Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id as number)}>
              <Text style={styles.buttonText}>🗑️ Eliminar</Text>
            </TouchableOpacity>

          </View>
        )}
      />

      {/* Paginación */}
      <View style={styles.paginationContainer}>
        <TouchableOpacity 
          style={styles.paginationButton} 
          onPress={() => setCurrentPage(Math.max(currentPage - 1, 1))}
        >
          <Text style={styles.paginationButtonText}>Anterior</Text>
        </TouchableOpacity>
        <Text style={styles.paginationText}>Página {currentPage}</Text>
        <TouchableOpacity 
          style={styles.paginationButton} 
          onPress={() => setCurrentPage(Math.min(currentPage + 1, Math.ceil(filteredCategories.length / itemsPerPage)))}
        >
          <Text style={styles.paginationButtonText}>Siguiente</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para agregar categoría */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Nueva Categoría</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={newCategory.name}
              onChangeText={(text) => setNewCategory({ ...newCategory, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Descripción"
              value={newCategory.description}
              onChangeText={(text) => setNewCategory({ ...newCategory, description: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="URL de Imagen"
              value={newCategory.image}
              onChangeText={(text) => setNewCategory({ ...newCategory, image: text })}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.smallButton} onPress={handleAddCategory}>
                <Text style={styles.buttonText}>Agregar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.smallButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para editar categoría */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Editar Categoría</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={editingCategory?.name || ""}
              onChangeText={(text) => setEditingCategory((prev) => prev ? { ...prev, name: text } : null)}
            />
            <TextInput
              style={styles.input}
              placeholder="Descripción"
              value={editingCategory?.description || ""}
              onChangeText={(text) => setEditingCategory((prev) => prev ? { ...prev, description: text } : null)}
            />
            <TextInput
              style={styles.input}
              placeholder="URL de Imagen"
              value={editingCategory?.image || ""}
              onChangeText={(text) => setEditingCategory((prev) => prev ? { ...prev, image: text } : null)}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.smallButton} onPress={handleEditCategory}>
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.smallButton, styles.cancelButton]} onPress={() => setEditModalVisible(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styless = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5", width: '90%', alignSelf: 'center' },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  searchInput: { backgroundColor: "white", padding: 12, borderRadius: 10, fontSize: 18, marginBottom: 15, borderWidth: 1, borderColor: "#ddd" },
  addButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  categoryItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  categoryImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 15,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  categoryDescription: {
    fontSize: 14,
    color: "#6c757d",
  },
  editButton: {
    backgroundColor: "#28a745",
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  smallButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    flex: 0.8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#dc3545",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  paginationButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  paginationButtonText: {
    color: "#fff",
  },
  paginationText: {
    fontSize: 16,
    marginHorizontal: 10,
  },
});
