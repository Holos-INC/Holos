import React from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

interface CategoryModalProps {
  visible: boolean;
  onClose: () => void;
  category: any;
  newCategory: { name: string; description: string; image: string };
  setNewCategory: (category: { name: string; description: string; image: string }) => void;
  onSave: () => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  visible,
  onClose,
  category,
  newCategory,
  setNewCategory,
  onSave,
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {category ? "Editar Categoría" : "Nueva Categoría"}
          </Text>
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
            placeholder="URL de imagen"
            value={newCategory.image}
            onChangeText={(text) => setNewCategory({ ...newCategory, image: text })}
          />
          <TouchableOpacity style={styles.saveButton} onPress={onSave}>
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "#183771",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#BBB",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CategoryModal;
