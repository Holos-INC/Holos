import api from "./axiosInstance"; // Asegúrate de tener una instancia de axios configurada
import { Report, ReportType } from "@/src/constants/ReportTypes"; // Ajusta el tipo según tu definición
import { API_URL } from "@/src/constants/api";

// URL base para los reportes
const REPORT_URL = `${API_URL}/reports`;
const REPORT_TYPE_URL = `${API_URL}/report-types`;

// Crear un nuevo reporte
export const createReport = async (
  reportName: string,
  description: string,
  workId: number,
  reportType?: string
): Promise<Report> => {
  const response = await api.post(`${REPORT_URL}/report`, {
    reportName,
    description,
    workId,
    type: reportType,
  });
  return response.data;
};

// Obtener todos los reportes (solo administradores)
export const getAllReports = async (): Promise<Report[]> => {
  const response = await api.get(`${REPORT_URL}/admin/allReports`);
  return response.data;
};

// Aceptar un reporte por ID
export const acceptReport = async (id: number): Promise<Report> => {
  const response = await api.put(`${REPORT_URL}/admin/accept/${id}`);
  return response.data;
};

// Rechazar un reporte por ID
export const rejectReport = async (id: number): Promise<Report> => {
  const response = await api.put(`${REPORT_URL}/admin/reject/${id}`);
  return response.data;
};

// Eliminar un reporte rechazado por ID
export const deleteReport = async (id: number): Promise<void> => {
  await api.delete(`${REPORT_URL}/admin/delete/${id}`);
};

// Obtener todos los tipos de reporte
export const getAllReportTypes = async (): Promise<ReportType[]> => {
  const response = await api.get(REPORT_TYPE_URL);
  return response.data;
};

// Crear un nuevo tipo de reporte (solo administradores)
export const createReportType = async (typeName: string): Promise<ReportType> => {
  const response = await api.post(`${REPORT_TYPE_URL}/admin/create`, {
    typeName,
  });
  return response.data;
};

// Actualizar un tipo de reporte por ID (solo administradores)
export const updateReportType = async (id: number, newTypeName: string): Promise<ReportType> => {
  const response = await api.put(`${REPORT_TYPE_URL}/admin/${id}`, {
    newTypeName,
  });
  return response.data;
};

// Eliminar un tipo de reporte por ID (solo administradores)
export const deleteReportType = async (id: number): Promise<void> => {
  await api.delete(`${REPORT_TYPE_URL}/admin/${id}`);
};
