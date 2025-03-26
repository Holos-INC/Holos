import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, Modal, TouchableOpacity, Image, Alert } from "react-native";
import styles from "@/src/styles/Admin.styles";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import {  createCategory, getAllCategories,updateCategory,deleteCategory  } from "@/src/services/categoryApi";
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
    category.name && category.name.toLowerCase().includes(searchText.toLowerCase())
  );
  

  // Obtener las categorías que se deben mostrar en la página actual
  const currentCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const handleAddCategory = async () => {
    if (!newCategory.name.trim() || !newCategory.description.trim()) {
      Alert.alert("Error", "El nombre y la descripción son obligatorios.");
      return;
    }
    try {
      const createdCategory = await createCategory(newCategory,loggedInUser.token);
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
    if (!editingCategory || !editingCategory.name.trim()) {
      Alert.alert("Error", "El nombre de la categoría no puede estar vacío.");
      return;
    }
  
    try {
      // Actualizamos la categoría
      console.log(editingCategory);
      await updateCategory(editingCategory.id, editingCategory,loggedInUser.token);

  
      // Si la actualización fue exitosa, actualizamos el estado
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id ? editingCategory : cat
      ));
      setEditModalVisible(false);
  
      Alert.alert("Éxito", "Categoría actualizada correctamente.");
    } catch (error: unknown) {
      // Comprobamos si el error es una instancia de Error
      if (error instanceof Error) {
        // Si el error es de tipo Error, mostramos el mensaje adecuado
        Alert.alert("Error", error.message || "No se pudo actualizar la categoría.");
      } else {
        // Si el error no es de tipo Error, mostramos un mensaje genérico
        Alert.alert("Error", "Ocurrió un error desconocido al intentar actualizar la categoría.");
      }
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
  
  const handleDelete = async (categoryId: number) => {
    try {
      // Llamamos a la función para eliminar la categoría
      await deleteCategory(categoryId,loggedInUser.token);
  
      // Si la eliminación fue exitosa, actualizamos el estado de categorías
      setCategories(categories.filter(category => category.id !== categoryId));
      Alert.alert("Éxito", "Categoría eliminada correctamente.");
    } catch (error: unknown) {
      // Comprobamos si el error es una instancia de Error
      if (error instanceof Error) {
        // Si el error es de tipo Error, comprobamos el mensaje
        if (error.message && error.message.includes("Foreign Key constraint fails")) {
          Alert.alert("Error", "No se puede eliminar la categoría porque está siendo utilizada por otros registros.");
        } else {
          Alert.alert("Error", "No se pudo eliminar la categoría.");
        }
      } else {
        // Si el error no es de tipo Error, mostramos un mensaje genérico
        Alert.alert("Error", "Ocurrió un error desconocido al intentar eliminar la categoría.");
      }
    }
  };
  
  
  


  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
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
                onChangeText={(text) => {
                  setEditingCategory((prev) => prev ? { ...prev, name: text } : prev);
                }}
              />

              <TextInput
                style={styles.input}
                placeholder="Descripción"
                value={editingCategory?.description || ""}
                onChangeText={(text) => {
                  setEditingCategory((prev) => prev ? { ...prev, description: text } : prev);
                }}
              />

              <TextInput
                style={styles.input}
                placeholder="URL de Imagen"
                value={editingCategory?.image || ""}
                onChangeText={(text) => {
                  setEditingCategory((prev) => prev ? { ...prev, image: text } : prev);
                }}
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