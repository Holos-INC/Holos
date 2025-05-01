import React, { useState, useEffect, useContext, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { getAllReports, acceptReport, deleteReport } from "@/src/services/reportApi";
import { Report, ReportStatus } from "@/src/constants/ReportTypes";
import styles from "@/src/styles/Admin.styles";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { AuthenticationContext } from "@/src/contexts/AuthContext";

export default function ReportManagement() {
  const router = useRouter();

  const { loggedInUser } = useContext(AuthenticationContext);
  const [reports, setReports] = useState<Report[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [status, setStatus] = useState<ReportStatus>(ReportStatus.PENDING);
  const [filter, setFilter] = useState<ReportStatus | "All">("All");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 8;
  const flatListRef = useRef<FlatList<Report>>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const fetchedReports = await getAllReports(loggedInUser.token);
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
    setErrorMessage(null);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedReport(null);
  };

  const handleStatusChange = async (newStatus: ReportStatus) => {
    if (!selectedReport) return;
  
    try {
      if (newStatus === ReportStatus.ACCEPTED) {
        await acceptReport(selectedReport.id, loggedInUser.token);
        closeModal();
      }
  
      setReports((prevReports) =>
        prevReports.map((report) =>
          report.id === selectedReport.id ? { ...report, status: newStatus } : report
        )
      );
      setStatus(newStatus);
      setErrorMessage(null); // Limpiar error si la acción es exitosa
    } catch (error: any) {
      let formattedMessage = "Error al actualizar el estado del reporte. Inténtalo de nuevo.";
  
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (typeof errorData === "string") {
          formattedMessage = errorData.includes(":")
            ? errorData.split(":")[1].trim()
            : errorData;
        } else if (typeof errorData === "object" && errorData.message) {
          formattedMessage = errorData.message.includes(":")
            ? errorData.message.split(":")[1].trim()
            : errorData.message;
        }
      }
  
      setErrorMessage(formattedMessage);
      console.error("Error al actualizar el estado del reporte:", error);
    }
  };
  

  const handleDeleteReport = async () => {
    if (!selectedReport) return;
  
    try {
      await deleteReport(selectedReport.id, loggedInUser.token);
      setReports((prevReports) => prevReports.filter((report) => report.id !== selectedReport.id));
      setErrorMessage(null); // Limpiar error si la eliminación es exitosa
      closeModal();
      router.reload();
    } catch (error: any) {
      let formattedMessage = "Error al eliminar el reporte. Inténtalo de nuevo.";
  
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (typeof errorData === "string") {
          formattedMessage = errorData.includes(":")
            ? errorData.split(":")[1].trim()
            : errorData;
        } else if (typeof errorData === "object" && errorData.message) {
          formattedMessage = errorData.message.includes(":")
            ? errorData.message.split(":")[1].trim()
            : errorData.message;
        }
      }
  
      setErrorMessage(formattedMessage);
      console.error("Error al eliminar el reporte:", error);
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
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const renderItem = ({ item }: { item: Report }) => (
    <TouchableOpacity style={styles.reportItem} onPress={() => openModal(item)}>
      <Text style={styles.reportTitle}>{item.name}</Text>
      <Text style={styles.reportDescription}>{item.description}</Text>
      <Text style={styles.reportStatus}>Estado: {item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
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
      </View>

      <FlatList
        ref={flatListRef}
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
            <Text style={styles.modalTitle}>Detalles del Reporte</Text>
            <Text style={styles.errorText}>{errorMessage}</Text>

            <Text style={styles.modalText} testID="title">Título: {selectedReport.name}</Text>
            <Text style={styles.modalText}>Descripción: {selectedReport.description}</Text>
            <Text style={styles.modalText}>Tipo de Reporte: {selectedReport.reportType?.type}</Text>
            <Text style={styles.modalText}>Trabajo: {selectedReport.work?.name}</Text>
            <Text style={styles.modalText}>Descripción del Trabajo: {selectedReport.work?.description}</Text>
            <Text style={styles.modalText}>Precio: ${selectedReport.work?.price}</Text>
            <Text style={styles.modalText}>Reportado por: {selectedReport.madeBy.name}</Text>
            <Text style={styles.modalText}>Reportado a: {selectedReport.reportedUser?.name}</Text>

            {selectedReport.status === ReportStatus.PENDING && (
              <View style={styles.buttonContainerReport}>
                <TouchableOpacity style={styles.editButton} onPress={() => handleStatusChange(ReportStatus.ACCEPTED)}>
                  <Text style={styles.buttonText}>✅ Aceptar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteReport()}>
                  <Text style={styles.buttonText}>❌ Rechazar</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity style={styles.button} onPress={closeModal}>
              <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )}
    </ScrollView>
    </ProtectedRoute>
  );
}
