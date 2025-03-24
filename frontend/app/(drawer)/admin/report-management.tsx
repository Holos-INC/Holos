import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, FlatList, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { getAllReports, acceptReport, rejectReport, deleteReport } from "@/src/services/reportApi"; 
import styles from "@/src/styles/Admin.styles";

export enum ReportStatus {
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  PENDING = 'PENDING',
}

export interface ReportType {
  id: number;
  type: string;
}

export interface BaseUser {
  id: number;
  name: string;
  username: string;
  password: string;
  email: string;
  phoneNumber?: string;
  imageProfile?: string;
  createdUser: string;
  authority: {
    id: number;
    authority: string;
  };
}

export interface Artist {
  id: number;
  numSlotsOfWork: number;
  tableCommissionsPrice: string;
  baseUser: BaseUser;
  name: string;
  username: string;
  email: string;
}

export interface Work {
  id: number;
  name: string;
  description: string;
  price: number;
  artist: Artist;
}

export interface Report {
  id?: number;
  name: string;
  description: string;
  status: ReportStatus;
  madeBy: BaseUser;
  reportedUser?: Artist;
  work?: Work;
  reportType?: ReportType;
}

export default function ReportManagement() {
  const router = useRouter();

  const [reports, setReports] = useState<Report[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [status, setStatus] = useState<ReportStatus>(ReportStatus.PENDING);
  const [filter, setFilter] = useState<ReportStatus | "All">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 8;

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const fetchedReports = await getAllReports();
        setReports(fetchedReports);
      } catch (error) {
        console.error("Error al obtener los reportes:", error);
      }
    };
    fetchReports();
  }, []);

  const openModal = (report: Report) => {
    setSelectedReport(report);
    setStatus(report.status);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedReport(null);
  };

  const handleStatusChange = async (newStatus: ReportStatus) => {
    if (selectedReport) {
      try {
        // Aquí llamamos a la API correspondiente para aceptar o rechazar el reporte
        if (newStatus === ReportStatus.ACCEPTED) {
          await acceptReport(selectedReport.id!);  // Aceptar el reporte
        } else if (newStatus === ReportStatus.REJECTED) {
          await rejectReport(selectedReport.id!);  // Rechazar el reporte
        }
        
        // Actualizamos el estado local para reflejar el cambio en la UI
        setReports((prevReports) =>
          prevReports.map((report) =>
            report.id === selectedReport.id ? { ...report, status: newStatus } : report
          )
        );
        setStatus(newStatus);
      } catch (error) {
        console.error("Error al actualizar el estado del reporte:", error);
      }
    }
  };

  const handleDeleteReport = async () => {
    if (selectedReport) {
      Alert.alert(
        "Eliminar Reporte",
        "¿Estás seguro de que quieres eliminar este reporte?",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Eliminar",
            onPress: async () => {
              try {
                await deleteReport(selectedReport.id!);  // Eliminar el reporte
                setReports((prevReports) =>
                  prevReports.filter((report) => report.id !== selectedReport.id)
                );
                closeModal();
              } catch (error) {
                console.error("Error al eliminar el reporte:", error);
              }
            },
          },
        ]
      );
    }
  };

  const filteredReports = reports.filter((report) =>
    filter === "All" ? true : report.status === filter
  );

  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * reportsPerPage,
    currentPage * reportsPerPage
  );

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const renderItem = ({ item }: { item: Report }) => (
    <TouchableOpacity style={styles.reportItem} onPress={() => openModal(item)}>
      <Text style={styles.reportTitle}>{item.name}</Text>
      <Text style={styles.reportDescription}>{item.description}</Text>
      <Text style={styles.reportStatus}>Estado: {item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Gestión de Reportes</Text>

      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilter("All")}>
          <Text style={styles.filterButtonText}>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilter(ReportStatus.PENDING)}>
          <Text style={styles.filterButtonText}>Pendientes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilter(ReportStatus.ACCEPTED)}>
          <Text style={styles.filterButtonText}>Aceptados</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilter(ReportStatus.REJECTED)}>
          <Text style={styles.filterButtonText}>Rechazados</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={paginatedReports}
        renderItem={renderItem}
        keyExtractor={(item) => item.id?.toString() || ""}
      />

      <View style={styles.paginationContainer}>
        <TouchableOpacity style={styles.paginationButton} onPress={prevPage} disabled={currentPage === 1}>
          <Text style={styles.paginationButtonText}>Anterior</Text>
        </TouchableOpacity>
        <Text style={styles.paginationText}>
          Página {currentPage} de {totalPages}
        </Text>
        <TouchableOpacity style={styles.paginationButton} onPress={nextPage} disabled={currentPage === totalPages}>
          <Text style={styles.paginationButtonText}>Siguiente</Text>
        </TouchableOpacity>
      </View>

      {selectedReport && (
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Actualizar Estado del Reporte</Text>

              <Text style={styles.modalText}>Título: {selectedReport.name}</Text>
              <Text style={styles.modalText}>Descripción: {selectedReport.description}</Text>
              <Text style={styles.modalText}>Tipo de Reporte: {selectedReport.reportType?.type}</Text>
              <Text style={styles.modalText}>Trabajo: {selectedReport.work?.name}</Text>
              <Text style={styles.modalText}>Descripción del Trabajo: {selectedReport.work?.description}</Text>
              <Text style={styles.modalText}>Precio: ${selectedReport.work?.price}</Text>
              <Text style={styles.modalText}>Reportado por: {selectedReport.madeBy.name}</Text>
              <Text style={styles.modalText}>Reportado a: {selectedReport.reportedUser?.name}</Text>

              <Picker
                selectedValue={status}
                style={styles.picker}
                onValueChange={(itemValue: ReportStatus) => handleStatusChange(itemValue)}
              >
                <Picker.Item label="Pendiente" value={ReportStatus.PENDING} />
                <Picker.Item label="Aceptado" value={ReportStatus.ACCEPTED} />
                <Picker.Item label="Rechazado" value={ReportStatus.REJECTED} />
              </Picker>

              <TouchableOpacity style={styles.button} onPress={closeModal}>
                <Text style={styles.buttonText}>Cerrar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={handleDeleteReport}>
                <Text style={styles.buttonText}>Eliminar Reporte</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
}
