import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Image, TextInput, ActivityIndicator, Alert, Modal,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {  getAllCategories, createCategory, updateCategory,} from "@/src/services/categoryApi";
import { AuthenticationContext } from "@/src/contexts/AuthContext";
import { Category } from "@/src/constants/CommissionTypes";
import styles from "@/src/styles/CategoriesStyles";
import CategoryCard from "@/src/components/categories/categoryCard";
import CategoryModal from "@/src/components/categories/categoryModal";
import ProtectedRoute from "@/src/components/ProtectedRoute";


// 2. Ajusta la pantalla
const { width } = Dimensions.get("window");
const isBigScreen = width >= 1024;
const MOBILE_PROFILE_ICON_SIZE = 40;
const MOBILE_CARD_PADDING = 12;
const BASE_URL = "http://localhost:8080";

export default function AdminCategories() {
  const { loggedInUser } = useContext(AuthenticationContext);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
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

  const handleSave = async () => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, newCategory);
      } else {
        await createCategory(newCategory);
      }
      Alert.alert("Éxito", "Categoría guardada correctamente.");
      setModalVisible(false);
      fetchCategories();
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar la categoría.");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <View style={styles.container}>
        <View style={styles.banner}>
          <Text style={styles.bannerText}>CATEGORÍAS</Text>
        </View>
  
        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>LISTA DE CATEGORÍAS</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#183771" />
          ) : categories.length === 0 ? (
            <Text style={styles.noCategoriesText}>No hay categorías disponibles.</Text>
          ) : (
            <View style={styles.categoriesContainer}>
              {categories.map((cat) => (
                <CategoryCard 
                  key={cat.id} 
                  category={cat} 
                  onEdit={(category) => {
                    setEditingCategory(category);
                    setNewCategory({
                      name: category.name ?? "",
                      description: category.description ?? "",
                      image: category.image ?? "",
                    });
                    setModalVisible(true);
                  }}
                />
              ))}
            </View>
          )}
        </ScrollView>
  
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setEditingCategory(null);
            setNewCategory({ name: "", description: "", image: "" });
            setModalVisible(true);
          }}
        >
          <Ionicons name="add-circle" size={30} color="#FFF" />
          <Text style={styles.addButtonText}>Agregar Categoría</Text>
        </TouchableOpacity>
  
       
        <CategoryModal 
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          category={editingCategory}
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          onSave={handleSave}
        />
      </View>
    </ProtectedRoute>
  );
  
}