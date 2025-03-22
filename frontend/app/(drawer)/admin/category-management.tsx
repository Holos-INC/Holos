import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, Modal, TouchableOpacity, Image, Alert } from "react-native";
import styles from "@/src/styles/Admin.styles";
import { createCategory, getAllCategories, updateCategory } from "@/src/services/categoryService";
import { AuthenticationContext } from "@/src/contexts/AuthContext";

interface Category {
  id: number;
  name: string;
  description: string;
  image?: string;
}
/*
export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState<Category>({ name: "", description: "", image: "" });
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
*/
  export default function CategoryManagement() {
    const { loggedInUser } = useContext(AuthenticationContext);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [newCategory, setNewCategory] = useState({
      name: "",
      description: "",
      image: "",
    });
  
    const fetchCategories = async () => {
      try {
        const data: Category[] = await getAllCategories();
        setCategories(data);
      } catch (error) {
        Alert.alert("Error", "Error al obtener las categorías.");
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchCategories();
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
/*
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
  */
  const handleAddCategory = async () => {
    if (!newCategory.name.trim() || !newCategory.description.trim()) {
      Alert.alert("Error", "El nombre y la descripción son obligatorios.");
      return;
    }
    try {
      const createdCategory = await createCategory(newCategory);
      setCategories([...categories, createdCategory]);
      setNewCategory({ name: "", description: "", image: "" });
      setModalVisible(false);
      Alert.alert("Éxito", "Categoría añadida correctamente.");
      fetchCategories();
    } catch (error) {
      Alert.alert("Error", "No se pudo agregar la categoría.");
    }
  };

  const handleEditCategory = async () => {
    if (!editingCategory || !editingCategory.name.trim() || !editingCategory.description.trim()) {
      Alert.alert("Error", "El nombre y la descripción no pueden estar vacíos.");
      return;
    }
    try {
      await updateCategory(editingCategory.id, editingCategory);
      setCategories(categories.map(cat => (cat.id === editingCategory.id ? editingCategory : cat)));
      setEditModalVisible(false);
      setEditingCategory(null);
      Alert.alert("Éxito", "Categoría actualizada correctamente.");
      fetchCategories();
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar la categoría.");
    }
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
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
