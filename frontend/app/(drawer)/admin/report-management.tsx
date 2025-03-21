import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, FlatList, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import styles from "./styles";

// Definir la estructura de los tipos de datos
interface Report {
  id: number;
  title: string;
  description: string;
  status: "Pending" | "Accepted" | "Rejected"; // Estado del reporte
  reportType: ReportType; // Relación con el tipo de reporte
  work: Work; // Relación con el trabajo
  userReport: User; // Usuario que realiza el reporte
  userReported: User; // Usuario al que se le hace el reporte
}

interface ReportType {
  type: string; // Tipo de reporte (Ejemplo: "Fraude")
}

interface Work {
  name: string;
  description: string;
  price: number;
}

interface User {
  id: number;
  name: string;
}

export default function ReportManagement() {
  const router = useRouter();

  // Estado de los reportes y del modal
  const [reports, setReports] = useState<Report[]>([
    {
      id: 1,
      title: "Reporte de Ejemplo 1",
      description: "Descripción del reporte 1",
      status: "Pending",
      reportType: { type: "Fraude" },
      work: { name: "Desarrollador Web", description: "Descripción del trabajo", price: 1000 },
      userReport: { id: 1, name: "Juan Pérez" },
      userReported: { id: 2, name: "Carlos Gómez" },
    },
    {
      id: 2,
      title: "Reporte de Ejemplo 2",
      description: "Descripción del reporte 2",
      status: "Accepted",
      reportType: { type: "Acoso" },
      work: { name: "Diseñador Gráfico", description: "Descripción del trabajo", price: 800 },
      userReport: { id: 3, name: "Ana López" },
      userReported: { id: 4, name: "Luis Martínez" },
    },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [status, setStatus] = useState<"Pending" | "Accepted" | "Rejected">("Pending");

  // Abrir el modal y cargar el reporte seleccionado
  const openModal = (report: Report) => {
    setSelectedReport(report);
    setStatus(report.status);
    setModalVisible(true);
  };

  // Cerrar el modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedReport(null);
  };

  // Cambiar el estado del reporte
  const handleStatusChange = (newStatus: "Pending" | "Accepted" | "Rejected") => {
    if (selectedReport) {
      selectedReport.status = newStatus;
      setReports([...reports]);
      setStatus(newStatus);
    }
  };

  // Eliminar el trabajo relacionado con el reporte
  const deleteWork = () => {
    if (selectedReport) {
      Alert.alert(
        "Eliminar Trabajo",
        "¿Estás seguro de que quieres eliminar el trabajo relacionado?",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Eliminar",
            onPress: () => {
              // Eliminar el trabajo (aquí solo se elimina el trabajo de este reporte)
              selectedReport.work = { name: "", description: "", price: 0 };
              setReports([...reports]);
              closeModal();
            },
          },
        ]
      );
    }
  };

  // Renderiza cada reporte en el listado
  const renderItem = ({ item }: { item: Report }) => (
    <TouchableOpacity style={styles.reportItem} onPress={() => openModal(item)}>
      <Text style={styles.reportTitle}>{item.title}</Text>
      <Text style={styles.reportDescription}>{item.description}</Text>
      <Text style={styles.reportStatus}>Estado: {item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Gestión de Reportes</Text>

      <FlatList
        data={reports}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />

      {/* Modal para cambiar el estado del reporte */}
      {selectedReport && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Actualizar Estado del Reporte</Text>

              {/* Detalles del reporte en el modal */}
              <Text style={styles.modalText}>Título: {selectedReport.title}</Text>
              <Text style={styles.modalText}>Descripción: {selectedReport.description}</Text>
              <Text style={styles.modalText}>Tipo de Reporte: {selectedReport.reportType.type}</Text>
              <Text style={styles.modalText}>Trabajo: {selectedReport.work.name}</Text>
              <Text style={styles.modalText}>Descripción del Trabajo: {selectedReport.work.description}</Text>
              <Text style={styles.modalText}>Precio: ${selectedReport.work.price}</Text>
              <Text style={styles.modalText}>Reportado por: {selectedReport.userReport.name}</Text>
              <Text style={styles.modalText}>Reportado a: {selectedReport.userReported.name}</Text>

              <Picker
                selectedValue={status}
                style={styles.picker}
                onValueChange={(itemValue: "Pending" | "Accepted" | "Rejected") => handleStatusChange(itemValue)}
              >
                <Picker.Item label="Pendiente" value="Pending" />
                <Picker.Item label="Aceptado" value="Accepted" />
                <Picker.Item label="Rechazado" value="Rejected" />
              </Picker>

              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  console.log("Estado del reporte actualizado:", status);
                  closeModal();
                }}
              >
                <Text style={styles.buttonText}>Actualizar Estado</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={deleteWork}
              >
                <Text style={styles.buttonText}>Eliminar Trabajo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={closeModal}
              >
                <Text style={styles.buttonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
}

