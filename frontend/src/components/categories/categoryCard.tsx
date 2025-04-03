import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Category } from "@/src/constants/CommissionTypes";
import styles from "@/src/styles/CategoriesStyles";

const BASE_URL = "http://localhost:8080";

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onEdit }) => {
  return (
    <View style={styles.card}>
      <View style={styles.categoryImageContainer}>
        <Image
          source={
            category.image?.startsWith("http")
              ? { uri: category.image }
              : { uri: `${BASE_URL}${category.image}` }
          }
          style={styles.categoryImage}
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.text}>{category.name ?? "Nombre no disponible"}</Text>
        <Text style={styles.text}>{category.description ?? "Descripción no disponible"}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton} onPress={() => onEdit(category)}>
          <Ionicons name="pencil" size={24} color="#183771" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CategoryCard;
