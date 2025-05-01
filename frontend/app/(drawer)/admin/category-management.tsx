import React, { useState, useEffect, useContext, useRef } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, Modal, TouchableOpacity, Image, Alert } from "react-native";
import styles from "@/src/styles/Admin.styles";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import {  createCategory, getAllCategories,updateCategory, deleteCategory } from "@/src/services/categoryApi";
import { BASE_URL } from "@/src/constants/api";
import ProtectedRoute from "@/src/components/ProtectedRoute";

interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string;
}
  export default function CategoryManagement() {
    const { loggedInUser } = useContext(AuthenticationContext);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [addError, setAddError] = useState<string | null>(null);
    const [editError, setEditError] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const itemsPerPage = 10;
    const [editModalVisible, setEditModalVisible] = useState(false);
      const flatListRef = useRef<FlatList<Category>>(null);
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

  
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  
  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      setAddError("El nombre no puede estar vacío.");
      return;
    }
    try {
      await createCategory(newCategory, loggedInUser.token);
      setNewCategory({ name: "", description: "", image: "" });
      setModalVisible(false);
      setAddError(null); // Limpiar errores si la operación es exitosa
      Alert.alert("Éxito", "Categoría añadida correctamente.");
      fetchCategories();
    } catch (error) {
      setAddError("Error al agregar la categoría.");
    }
  };
  
  

  const handleEditCategory = async () => {
    if (!editingCategory || !editingCategory.name.trim()) {
      setEditError("El nombre no puede estar vacío.");
      return;
    }
    try {
      await updateCategory(editingCategory.id, editingCategory, loggedInUser.token);
      setEditModalVisible(false);
      setEditingCategory(null);
      setEditError(null); // Limpiar errores si la operación es exitosa
      Alert.alert("Éxito", "Categoría actualizada correctamente.");
      fetchCategories();
    } catch (error) {
      setEditError("Error al actualizar la categoría.");
    }
  };
  
  

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setEditModalVisible(true);
    setEditError(null)
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    setCurrentPage(1); // Volver a la primera página al buscar
  };

  const handleDelete = async (categoryId: number) => {
    try {
      await deleteCategory(categoryId, loggedInUser.token);
      setCategories(categories.filter(category => category.id !== categoryId));
      setDeleteError(null); // Limpiar errores si la operación es exitosa
      Alert.alert("Éxito", "Categoría eliminada correctamente.");
    } catch (error) {
      setDeleteError("Error al eliminar la categoría.");
    }
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };
  
  const goToNextPage = () => {
    setCurrentPage((prevPage) =>
      Math.min(prevPage + 1, Math.ceil(filteredCategories.length / itemsPerPage))
    );
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };
  


  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
    <View style={styles.container}>
      <Text style={styles.title}>Administrar Categorías</Text>
      {deleteError && <Text style={styles.errorText}>{deleteError}</Text>}
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
        ref={flatListRef}
        data={currentCategories}
        keyExtractor={(item) => item.id?.toString() || ""}
        renderItem={({ item }) => (
          <View style={styles.categoryItem}>
            <Image 
              source={{ uri: item.image ? (item.image.startsWith("http") ? item.image : `${BASE_URL}${item.image}`) : "https://via.placeholder.com/150" }} 
              style={styles.categoryImage} 
            />
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
            onPress={goToPreviousPage} 
            disabled={currentPage === 1}
          >
            <Text style={styles.paginationButtonText}>Anterior</Text>
          </TouchableOpacity>
        <Text style={styles.paginationText}>{`${currentPage} de ${totalPages}`}</Text>
        <TouchableOpacity 
            style={styles.paginationButton} 
            onPress={goToNextPage} 
            disabled={currentPage === totalPages}
          >
            <Text style={styles.paginationButtonText}>Siguiente</Text>
          </TouchableOpacity>
      </View>

      {/* Modal para agregar categoría */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Nueva Categoría</Text>
            {addError && <Text style={styles.errorText}>{addError}</Text>}
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
            {editError && <Text style={styles.errorText}>{editError}</Text>}
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
    </ProtectedRoute>
  );
}